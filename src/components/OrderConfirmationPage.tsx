import { CartProvider } from '../context/CartContext'
import OrderConfirmationContent from './OrderConfirmationContent'

// OrderConfirmationPage mora imati svoj CartProvider jer se renderira kao client:only="react"
// unutar Astro slot-a, što ne može pristupiti React contextu iz AppWrapper-a
export default function OrderConfirmationPage() {
  return (
    <CartProvider>
      <div className="container mx-auto px-4 py-12">
        <OrderConfirmationContent />
      </div>
    </CartProvider>
  )
}

