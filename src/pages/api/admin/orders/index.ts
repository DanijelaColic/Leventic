import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../../lib/supabase'

// GET - Dohvaćanje svih narudžbi
export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST - Kreiranje nove narudžbe (ovo će se zvati iz checkout-a)
export const POST: APIRoute = async ({ request }) => {
  try {
    const order = await request.json()

    // Generiraj order number
    const orderNumber = `ORD-${Date.now()}`
    order.order_number = orderNumber

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([order])
      .select()

    if (error) throw error

    return new Response(JSON.stringify(data[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return new Response(JSON.stringify({ error: 'Failed to create order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

