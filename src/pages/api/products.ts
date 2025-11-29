import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'

/**
 * Public API endpoint za dohvaćanje proizvoda
 * Ovaj endpoint se može koristiti na frontend-u da dohvati
 * proizvode iz Supabase umjesto statičnog products.ts fajla
 */
export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')

    if (error) {
      // Ako nema proizvoda u Supabase, koristi fallback
      console.warn('Supabase products not found, using local data')
      
      // Možete importati lokalne proizvode kao fallback
      // const { products } = await import('../../data/products')
      // return new Response(JSON.stringify(products), { ... })
      
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

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

