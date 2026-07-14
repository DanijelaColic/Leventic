import { supabaseAdmin } from './supabase'
import { formatOrderDateKey } from '../utils/orderNumberFormat'

export { stripOrderPrefix, toDbOrderNumber, formatOrderDateKey } from '../utils/orderNumberFormat'

/**
 * Generira kratki broj narudžbe / poziv na broj (max 9 znamenki, HR00-safe).
 * Preferira Supabase RPC; fallback broji postojeće narudžbe za današnji dan.
 */
export async function generateOrderNumber(): Promise<string> {
  const { data, error } = await supabaseAdmin.rpc('generate_order_number')

  if (!error && data) {
    return String(data)
  }

  console.warn('[orderNumber] RPC unavailable, using fallback:', error?.message)
  return generateOrderNumberFallback()
}

async function generateOrderNumberFallback(): Promise<string> {
  const dateKey = formatOrderDateKey()
  const dbPrefix = `ORD-${dateKey}`

  const { count, error } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .like('order_number', `${dbPrefix}%`)

  if (error) {
    const random = Math.floor(Math.random() * 900 + 100)
    return `${dateKey}${random}`
  }

  const next = ((count ?? 0) + 1).toString().padStart(3, '0')
  return `${dateKey}${next}`
}
