import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../../lib/supabase'

// GET - Dohvaćanje svih postavki
export const GET: APIRoute = async () => {
  try {
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
  } catch (error) {
    console.error('Error fetching settings:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch settings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
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

