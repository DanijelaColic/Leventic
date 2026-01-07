import type { CartItem } from '../context/CartContext'
// Narudžbe ne koriste cookie consent provjeru jer su esencijalne funkcionalnosti za kupnju
export type { CartItem }

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
 * Sprema narudžbu u localStorage
 */
export function saveOrder(order: Order): void {
  // Narudžbe su esencijalne za kupnju - rade uvijek, bez obzira na cookie consent
  // Ovo je potrebno jer korisnik mora moći napraviti narudžbu prije nego što prihvati kolačiće
  const orders = getOrders()
  orders.push(order)
  localStorage.setItem('eko-leventic-orders', JSON.stringify(orders))
}

/**
 * Dohvaća sve narudžbe iz localStorage
 */
export function getOrders(): Order[] {
  // Narudžbe su esencijalne za kupnju - rade uvijek, bez obzira na cookie consent
  // Ovo je potrebno jer korisnik mora moći vidjeti svoje narudžbe prije nego što prihvati kolačiće
  const saved = localStorage.getItem('eko-leventic-orders')
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

