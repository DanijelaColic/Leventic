import type { APIRoute } from 'astro'
import { supabaseAdmin } from '../../../../lib/supabase'

// PUT - Ažuriranje proizvoda
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params
    const updates = await request.json()

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error

    return new Response(JSON.stringify(data[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return new Response(JSON.stringify({ error: 'Failed to update product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
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

