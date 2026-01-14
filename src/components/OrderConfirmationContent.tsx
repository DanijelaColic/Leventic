import { useEffect, useState } from 'react'
import OrderConfirmation from './OrderConfirmation'

// Force rebuild - Updated at 14:40
export default function OrderConfirmationContent() {
  // Initialize orderId as null, will be set in useEffect
  // This ensures it works correctly with client:only="react"
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Dohvati orderId iz URL parametara
    // This runs only on client side (client:only="react")
    console.log('OrderConfirmationContent: Current URL:', window.location.href)
    console.log('OrderConfirmationContent: Search params:', window.location.search)
    
    const params = new URLSearchParams(window.location.search)
    const id = params.get('orderId')
    
    console.log('OrderConfirmationContent: Extracted orderId:', id)
    
    if (id) {
      setOrderId(id)
      console.log('OrderConfirmationContent: orderId set to:', id)
    } else {
      // Ako nema orderId u URL-u, možda je korisnik direktno došao na stranicu
      // Možemo pokušati dohvatiti iz localStorage ili redirectati na shop
      console.warn('Order ID not found in URL')
      setOrderId(null)
    }
    
    setIsInitialized(true)
  }, []) // Empty dependency array - run only once on mount

  // Show loading state while reading orderId from URL
  if (!isInitialized) {
    console.log('OrderConfirmationContent: Initializing, reading orderId from URL...')
    return (
      <div className="text-center py-12">
        <p className="text-lg">Učitavanje...</p>
      </div>
    )
  }

  if (!orderId) {
    console.log('OrderConfirmationContent: orderId is null, showing error message')
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600 mb-4">
          Broj narudžbe nije pronađen
        </p>
        <a
          href="/shop"
          className="text-primary-600 hover:text-primary-700 underline"
        >
          Povratak na shop
        </a>
      </div>
    )
  }

  console.log('OrderConfirmationContent: Rendering OrderConfirmation with orderId:', orderId)
  return <OrderConfirmation orderId={orderId} />
}



