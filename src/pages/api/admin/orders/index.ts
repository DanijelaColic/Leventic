import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../../lib/supabase'
import {
  validateCheckoutPayload,
  createOrderInDatabase,
  logCheckoutFailure,
} from '../../../../lib/checkoutOrder'

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

// POST - Kreiranje nove narudžbe (admin panel — koristi istu logiku kao javni checkout)
export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.json()
    const validation = validateCheckoutPayload(rawBody)

    if (!validation.ok) {
      return new Response(
        JSON.stringify({ error: 'Validacija nije prošla', details: validation.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const order = validation.data
    const result = await createOrderInDatabase(order)

    if (result.error) {
      await logCheckoutFailure({
        order_number: order.order_number,
        customer_email: order.customer_email,
        error_code: 'ADMIN_CREATE_FAILED',
        error_message: result.error,
      })
      return new Response(
        JSON.stringify({ error: 'Failed to create order', details: result.error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return new Response(JSON.stringify(result.data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('[API] Error creating order:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to create order',
        details: error?.message || 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}

