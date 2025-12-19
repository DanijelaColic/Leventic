import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../../lib/supabase'

// PUT - Ažuriranje proizvoda
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params
    const updates = await request.json()

    // Osiguraj da available je boolean (ne undefined ili null)
    const updatesToSend = { ...updates }
    if (updatesToSend.available !== undefined) {
      updatesToSend.available = Boolean(updatesToSend.available)
    }
    
    console.log('Updating product - available value:', updatesToSend.available, 'type:', typeof updatesToSend.available)
    
    // Ažuriraj proizvod (sada bi available kolona trebala postojati)
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updatesToSend)
      .eq('id', id)
      .select()

    if (error) {
      // Ako je greška vezana za available kolonu, možda schema cache još nije osvježen
      if (error.code === 'PGRST204' && error.message?.includes('available')) {
        console.warn('Available kolona možda još nije vidljiva u schema cache-u')
        console.warn('Molimo osvježite schema cache u Supabase Dashboard → Settings → API')
        // Vrati grešku da korisnik zna što se dogodilo
        throw new Error('Available kolona ne postoji u schema cache-u. Molimo osvježite schema cache u Supabase Dashboard.')
      }
      throw error
    }

    return new Response(JSON.stringify(data[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return new Response(
      JSON.stringify({
        error: error?.message || 'Failed to update product',
        details: error,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// DELETE - Brisanje proizvoda
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id)

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

