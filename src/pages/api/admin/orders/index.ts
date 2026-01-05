import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../../lib/supabase'

// GET - Dohvaćanje svih narudžbi
export const GET: APIRoute = async () => {
  try {
    // Provjeri da li su Supabase kredencijali postavljeni
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
    const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({
          error: 'Supabase nije konfiguriran. Provjerite .env fajl sa PUBLIC_SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    
    // Detaljnija greška za debugging
    const errorMessage = error?.message || 'Nepoznata greška'
    const isNetworkError = errorMessage.includes('ENOTFOUND') || errorMessage.includes('fetch failed')
    
    return new Response(
      JSON.stringify({
        error: isNetworkError
          ? 'Ne mogu se povezati na Supabase. Provjerite da li je PUBLIC_SUPABASE_URL ispravan u .env fajlu.'
          : `Greška pri dohvaćanju narudžbi: ${errorMessage}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
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

