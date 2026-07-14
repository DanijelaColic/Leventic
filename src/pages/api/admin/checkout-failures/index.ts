import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../../lib/supabase'

/** Admin: dohvat neuspjelih pokušaja checkouta */
export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('checkout_failures')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      // Tablica možda ne postoji još
      console.warn('[checkout-failures] DB error:', error.message)
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('[checkout-failures] Error:', error)
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
