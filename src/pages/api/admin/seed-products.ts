import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../lib/supabase'
import { products } from '../../../data/products'

/**
 * API endpoint za punjenje proizvoda u Supabase
 * POST /api/admin/seed-products
 * 
 * Ovaj endpoint će dodati sve proizvode iz products.ts u Supabase bazu
 */
export const POST: APIRoute = async () => {
  try {
    console.log(`🌾 Starting to seed ${products.length} products...`)

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const product of products) {
      try {
        const dbProduct = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          unit: product.unit,
          emoji: product.emoji,
          image: product.image,
          images: product.images || null,
          variants: product.variants || null,
          detailed_description: product.detailedDescription || null,
          usage: product.usage || null,
          ingredients: product.ingredients || null,
          notes: product.notes || null,
          storage: product.storage || null,
          expiry: product.expiry || null,
          nutrition: product.nutrition || null,
        }

        const { data, error } = await supabaseAdmin
          .from('products')
          .upsert(dbProduct, { onConflict: 'id' })
          .select()

        if (error) {
          console.error(`❌ Error seeding product ${product.name}:`, error)
          results.push({
            product: product.name,
            status: 'error',
            message: error.message,
          })
          errorCount++
        } else {
          console.log(`✅ Successfully seeded: ${product.name}`)
          results.push({
            product: product.name,
            status: 'success',
          })
          successCount++
        }
      } catch (err) {
        console.error(`❌ Exception seeding product ${product.name}:`, err)
        results.push({
          product: product.name,
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error',
        })
        errorCount++
      }
    }

    const summary = {
      total: products.length,
      success: successCount,
      errors: errorCount,
      results,
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✅ Successfully seeded: ${successCount} products`)
    console.log(`❌ Errors: ${errorCount} products`)
    console.log('='.repeat(50))

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Fatal error during seeding:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to seed products',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

