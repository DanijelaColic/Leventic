import { useEffect, useState } from 'react'
import OrderConfirmation from './OrderConfirmation'

// Force rebuild - Updated at 14:40
export default function OrderConfirmationContent() {
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    // Dohvati orderId iz URL parametara
    console.log('OrderConfirmationContent: Current URL:', window.location.href)
    console.log('OrderConfirmationContent: Search params:', window.location.search)
    
    const params = new URLSearchParams(window.location.search)
    const id = params.get('orderId')
    
    console.log('OrderConfirmationContent: Extracted orderId:', id)
    
    if (id) {
      setOrderId(id)
    } else {
      // Ako nema orderId u URL-u, možda je korisnik direktno došao na stranicu
      // Možemo pokušati dohvatiti iz localStorage ili redirectati na shop
      console.warn('Order ID not found in URL')
    }
  }, [])

  if (!orderId) {
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

  return <OrderConfirmation orderId={orderId} />
}



