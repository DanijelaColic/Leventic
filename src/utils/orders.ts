import type { CartItem } from '../context/CartContext'
import type { Product } from '../data/products'
// Narudžbe ne koriste cookie consent provjeru jer su esencijalne funkcionalnosti za kupnju
export type { CartItem }

const MAX_STORED_ORDERS = 5
const ORDERS_STORAGE_KEY = 'eko-leventic-orders'

/** Spremi samo polja potrebna za prikaz — smanjuje localStorage footprint */
function compactProduct(product: Product): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    unit: product.unit || 'kom',
    emoji: product.emoji || '',
    image: product.image || '',
  }
}

function compactOrder(order: Order): Order {
  return {
    ...order,
    items: order.items.map((item) => ({
      quantity: item.quantity,
      product: compactProduct(item.product),
    })),
  }
}

export type OrderStatus = 'pending_payment' | 'processing' | 'shipped' | 'completed' | 'cancelled'

export type DeliveryMethod = 'delivery' | 'pickup'

export interface Order {
  id: string // Broj narudžbe (npr. 12345678, bez # - dodaje se samo za prikaz)
  orderNumber: string // Isti kao id (npr. 12345678)
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  status: OrderStatus
  createdAt: string // ISO date string
  paymentReference: string // Broj narudžbe kao payment reference
  deliveryMethod: DeliveryMethod // 'delivery' = dostava, 'pickup' = osobno preuzimanje
}

/**
 * Generira jedinstveni broj narudžbe
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `${timestamp}${random}`.slice(-8) // Zadnje 8 znamenki
}

/**
 * Sprema narudžbu u localStorage (backup za prikaz potvrde).
 * Nikad ne baca grešku — checkout ne smije pasti zbog punog/blokiranog storagea.
 * @returns true ako je spremanje uspjelo
 */
export function saveOrder(order: Order): boolean {
  try {
    const orders = getOrders()
    const compact = compactOrder(order)
    const existingIndex = orders.findIndex((o) => o.id === order.id)

    if (existingIndex >= 0) {
      orders[existingIndex] = compact
    } else {
      orders.push(compact)
    }

    const trimmed = orders.slice(-MAX_STORED_ORDERS).map(compactOrder)
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(trimmed))
    return true
  } catch (error) {
    console.warn('saveOrder failed, retrying with only current order:', error)
    try {
      localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify([compactOrder(order)]),
      )
      return true
    } catch (retryError) {
      console.warn('saveOrder completely failed (non-critical):', retryError)
      return false
    }
  }
}

/**
 * Dohvaća sve narudžbe iz localStorage
 */
export function getOrders(): Order[] {
  // Narudžbe su esencijalne za kupnju - rade uvijek, bez obzira na cookie consent
  // Ovo je potrebno jer korisnik mora moći vidjeti svoje narudžbe prije nego što prihvati kolačiće
  const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
  if (!saved) return []
  try {
    return JSON.parse(saved)
  } catch {
    return []
  }
}

/**
 * Dohvaća narudžbu po ID-u
 * Radi s oba formata - s # i bez # (za kompatibilnost sa starim narudžbama)
 */
export function getOrderById(orderId: string): Order | null {
  const orders = getOrders()
  
  // Probaj pronaći s točnim ID-om
  let order = orders.find((o) => o.id === orderId)
  
  // Ako nije pronađen i orderId ne sadrži #, probaj s #
  if (!order && !orderId.startsWith('#')) {
    order = orders.find((o) => o.id === `#${orderId}`)
  }
  
  // Ako nije pronađen i orderId sadrži #, probaj bez #
  if (!order && orderId.startsWith('#')) {
    order = orders.find((o) => o.id === orderId.substring(1))
  }
  
  return order || null
}

