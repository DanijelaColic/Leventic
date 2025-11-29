import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../../lib/supabase'

// GET - Dohvaćanje svih proizvoda
export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('name')

    if (error) throw error

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST - Dodavanje novog proizvoda
export const POST: APIRoute = async ({ request }) => {
  try {
    const product = await request.json()

    // Generiraj ID ako ne postoji
    if (!product.id) {
      product.id = Date.now().toString()
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([product])
      .select()

    if (error) throw error

    return new Response(JSON.stringify(data[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return new Response(JSON.stringify({ error: 'Failed to create product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

