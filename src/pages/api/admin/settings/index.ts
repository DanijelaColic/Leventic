import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../../lib/supabase'

// GET - Dohvaćanje svih postavki
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

    const { data, error } = await supabaseAdmin.from('settings').select('*')

    if (error) throw error

    // Pretvori u objekt { key: value }
    const settings: any = {}
    data?.forEach((setting) => {
      settings[setting.key] = setting.value
    })

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    
    // Detaljnija greška za debugging
    const errorMessage = error?.message || 'Nepoznata greška'
    const isNetworkError = errorMessage.includes('ENOTFOUND') || errorMessage.includes('fetch failed')
    
    return new Response(
      JSON.stringify({
        error: isNetworkError
          ? 'Ne mogu se povezati na Supabase. Provjerite da li je PUBLIC_SUPABASE_URL ispravan u .env fajlu.'
          : `Greška pri dohvaćanju postavki: ${errorMessage}`,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// PUT - Ažuriranje postavki
export const PUT: APIRoute = async ({ request }) => {
  try {
    const settings = await request.json()

    // Ažuriraj svaku postavku pojedinačno
    const promises = Object.entries(settings).map(([key, value]) =>
      supabaseAdmin
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' })
    )

    await Promise.all(promises)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return new Response(JSON.stringify({ error: 'Failed to update settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

