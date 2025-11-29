import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../../lib/supabase'

// PUT - Ažuriranje narudžbe (npr. status)
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params
    const updates = await request.json()

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error

    return new Response(JSON.stringify(data[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return new Response(JSON.stringify({ error: 'Failed to update order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// DELETE - Brisanje narudžbe
export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params

    const { error } = await supabaseAdmin.from('orders').delete().eq('id', id)

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error deleting order:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

