import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (for browser)
export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
)

// Server-side Supabase client (for API routes with service role)
export const supabaseAdmin = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
)

// Database types
export type DbProduct = {
  id: string
  name: string
  description: string
  price: number
  unit: string
  emoji: string
  image: string
  images?: string[]
  variants?: Array<{ weight: string; price: number }>
  detailed_description?: string
  usage?: string
  ingredients?: string
  notes?: string
  storage?: string
  expiry?: string
  nutrition?: {
    energy: string
    fat: string
    saturatedFat?: string
    carbs: string
    sugars?: string
    fiber?: string
    protein: string
    salt?: string
  }
  created_at?: string
  updated_at?: string
}

export type DbOrder = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_postal_code: string
  items: Array<{
    productId: string
    productName: string
    variant?: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping_cost: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
}

export type DbSettings = {
  id: string
  key: string
  value: any
  updated_at: string
}

