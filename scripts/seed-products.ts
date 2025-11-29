/**
 * Skripta za punjenje proizvoda u Supabase bazu
 * 
 * Korištenje:
 * 1. Provjerite da su environment varijable postavljene u .env
 * 2. Pokrenite: npx tsx scripts/seed-products.ts
 */

import { createClient } from '@supabase/supabase-js'
import { products } from '../src/data/products'

// Učitavanje environment varijabli
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ ERROR: Supabase credentials not found!')
  console.error('Provjerite da su PUBLIC_SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY postavljeni u .env fajlu')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seedProducts() {
  console.log('🌾 Početak punjenja proizvoda u Supabase...\n')

  try {
    // Prvo provjerimo da li već postoje proizvodi
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')

    if (checkError) {
      console.error('❌ Greška pri provjeri postojećih proizvoda:', checkError)
      return
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log(`⚠️  Pronađeno ${existingProducts.length} postojećih proizvoda u bazi`)
      console.log('   Da li želite dodati nove proizvode ili zamijeniti postojeće?')
      console.log('   Za zamjenu, prvo obrišite proizvode iz Supabase Table Editor-a\n')
    }

    // Insertanje proizvoda jedan po jedan sa detaljnim outputom
    let successCount = 0
    let errorCount = 0

    for (const product of products) {
      console.log(`📦 Dodavanje: ${product.name}`)

      const { data, error } = await supabase
        .from('products')
        .upsert(
          {
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
          },
          { onConflict: 'id' }
        )

      if (error) {
        console.error(`   ❌ Greška: ${error.message}`)
        errorCount++
      } else {
        console.log(`   ✅ Uspješno dodano (ID: ${product.id})`)
        successCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✅ Uspješno dodano: ${successCount} proizvoda`)
    if (errorCount > 0) {
      console.log(`❌ Greške: ${errorCount} proizvoda`)
    }
    console.log('='.repeat(50) + '\n')

    // Provjera ukupnog broja proizvoda u bazi
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Ukupno proizvoda u bazi: ${count}\n`)
    console.log('🎉 Gotovo! Proizvodi su sada dostupni u admin panelu.\n')
  } catch (error) {
    console.error('❌ Neočekivana greška:', error)
  }
}

// Pokretanje skripte
seedProducts()

