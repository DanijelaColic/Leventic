import { supabaseAdmin } from './supabase'
import { generateOrderNumber, toDbOrderNumber } from './orderNumber'

export { parseCartProductId } from '../utils/cartProductId'

export type CheckoutOrderItem = {
  productId: string
  productName: string
  variant?: string
  quantity: number
  price: number
}

export type CheckoutOrderPayload = {
  order_number?: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_postal_code: string
  items: CheckoutOrderItem[]
  subtotal: number
  shipping_cost: number
  total: number
  status: string
  notes?: string
}

export type ValidationResult =
  | { ok: true; data: CheckoutOrderPayload }
  | { ok: false; errors: string[] }

const MAX_NAME = 100
const MAX_EMAIL = 254
const MAX_PHONE = 30
const MAX_ADDRESS = 200
const MAX_CITY = 100
const MAX_POSTAL = 20
const MAX_NOTES = 2000
const MAX_ORDER_NUMBER = 64

/** Trim i ograniči duljinu — čuva hrvatske znakove (č, ć, š, ž, đ) */
export function sanitizeText(value: unknown, maxLen: number): string {
  if (value === null || value === undefined) return ''
  return String(value).trim().slice(0, maxLen)
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function validateCheckoutPayload(
  raw: unknown,
): ValidationResult {
  const errors: string[] = []

  if (!raw || typeof raw !== 'object') {
    return { ok: false, errors: ['Neispravan format zahtjeva'] }
  }

  const body = raw as Record<string, unknown>

  const order_number = body.order_number
    ? sanitizeText(body.order_number, MAX_ORDER_NUMBER)
    : ''
  const customer_name = sanitizeText(body.customer_name, MAX_NAME * 2)
  const customer_email = sanitizeText(body.customer_email, MAX_EMAIL).toLowerCase()
  const customer_phone = sanitizeText(body.customer_phone, MAX_PHONE)
  const customer_address = sanitizeText(body.customer_address, MAX_ADDRESS)
  const customer_city = sanitizeText(body.customer_city, MAX_CITY)
  const customer_postal_code = sanitizeText(body.customer_postal_code, MAX_POSTAL)
  const notes = body.notes ? sanitizeText(body.notes, MAX_NOTES) : undefined

  if (!customer_name || customer_name.length < 2) {
    errors.push('Ime i prezime su obavezni')
  }
  if (!customer_email) {
    errors.push('Email je obavezan')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
    errors.push('Nevažeća email adresa')
  }
  if (!customer_phone || customer_phone.length < 6) {
    errors.push('Telefon je obavezan (min. 6 znakova)')
  } else if (!/^[\d\s+\-/()]+$/.test(customer_phone)) {
    errors.push('Telefon sadrži nevažeće znakove')
  }
  if (!customer_address) errors.push('Adresa je obavezna')
  if (!customer_city) errors.push('Grad je obavezan')
  if (!customer_postal_code) errors.push('Poštanski broj je obavezan')

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push('Košarica je prazna')
  }

  const items: CheckoutOrderItem[] = []

  if (Array.isArray(body.items)) {
    body.items.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`Stavka ${index + 1} nije ispravna`)
        return
      }
      const row = item as Record<string, unknown>
      const productId = sanitizeText(row.productId, 64)
      const productName = sanitizeText(row.productName, MAX_NAME * 2)
      const quantity = Number(row.quantity)
      const price = Number(row.price)

      if (!productId) errors.push(`Stavka ${index + 1}: nedostaje ID proizvoda`)
      if (!productName) errors.push(`Stavka ${index + 1}: nedostaje naziv`)
      if (!Number.isFinite(quantity) || quantity < 1 || quantity > 999) {
        errors.push(`Stavka ${index + 1}: nevažeća količina`)
      }
      if (!Number.isFinite(price) || price < 0) {
        errors.push(`Stavka ${index + 1}: nevažeća cijena`)
      }

      const variant = row.variant
        ? sanitizeText(row.variant, 20)
        : undefined

      items.push({
        productId,
        productName,
        variant,
        quantity: Math.floor(quantity),
        price: roundMoney(price),
      })
    })
  }

  const subtotal = roundMoney(Number(body.subtotal))
  const shipping_cost = roundMoney(Number(body.shipping_cost))
  const total = roundMoney(Number(body.total))

  if (!Number.isFinite(subtotal) || subtotal < 0) {
    errors.push('Neispravan međuzbir')
  }
  if (!Number.isFinite(shipping_cost) || shipping_cost < 0) {
    errors.push('Neispravna cijena dostave')
  }
  if (!Number.isFinite(total) || total < 0) {
    errors.push('Neispravan ukupni iznos')
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    data: {
      ...(order_number ? { order_number } : {}),
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_postal_code,
      items,
      subtotal,
      shipping_cost,
      total,
      status: 'pending',
      notes,
    },
  }
}

export async function createOrderInDatabase(
  order: CheckoutOrderPayload,
): Promise<{ data: unknown; error: null } | { data: null; error: string }> {
  const maxAttempts = 3

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const orderToInsert = { ...order }

    if (!orderToInsert.order_number) {
      const shortNumber = await generateOrderNumber()
      orderToInsert.order_number = toDbOrderNumber(shortNumber)
    } else if (!orderToInsert.order_number.startsWith('ORD-')) {
      orderToInsert.order_number = toDbOrderNumber(orderToInsert.order_number)
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([orderToInsert])
      .select()
      .single()

    if (!error) {
      console.log('[checkoutOrder] Order saved:', {
        id: (data as { id?: string })?.id,
        order_number: orderToInsert.order_number,
        customer_email: order.customer_email,
        total: order.total,
      })
      return { data, error: null }
    }

    const isDuplicate =
      error.message.includes('duplicate') ||
      error.message.includes('unique')

    console.error('[checkoutOrder] Supabase insert error:', {
      attempt: attempt + 1,
      code: error.code,
      message: error.message,
      order_number: orderToInsert.order_number,
      customer_email: order.customer_email,
    })

    if (isDuplicate && attempt < maxAttempts - 1) {
      order.order_number = undefined
      continue
    }

    return { data: null, error: error.message }
  }

  return { data: null, error: 'Narudžba nije spremljena nakon više pokušaja' }
}

export type CheckoutFailureLog = {
  order_number?: string
  customer_email?: string
  customer_name?: string
  customer_phone?: string
  error_code: string
  error_message: string
  error_details?: Record<string, unknown>
  request_payload?: Record<string, unknown>
  user_agent?: string
}

/** Zapisuje neuspjeli pokušaj u Supabase (tablica checkout_failures) */
export async function logCheckoutFailure(
  failure: CheckoutFailureLog,
): Promise<void> {
  const row = {
    order_number: failure.order_number || null,
    customer_email: failure.customer_email || null,
    customer_name: failure.customer_name || null,
    customer_phone: failure.customer_phone || null,
    error_code: failure.error_code,
    error_message: failure.error_message,
    error_details: failure.error_details || null,
    request_payload: failure.request_payload || null,
    user_agent: failure.user_agent || null,
  }

  console.error('[checkoutOrder] CHECKOUT FAILURE:', JSON.stringify(row))

  try {
    const { error } = await supabaseAdmin.from('checkout_failures').insert([row])

    if (error) {
      // Tablica možda još ne postoji — log ostaje u Vercel logovima
      console.error('[checkoutOrder] Could not save failure to DB:', error.message)
    }
  } catch (e) {
    console.error('[checkoutOrder] logCheckoutFailure exception:', e)
  }
}
