import { CartProvider } from '../context/CartContext'
import CheckoutContent from './CheckoutContent'

// CheckoutPage mora imati svoj CartProvider jer se renderira kao client:only="react"
// unutar Astro slot-a, što ne može pristupiti React contextu iz AppWrapper-a
// Košarica se učitava iz localStorage, tako da će biti ista kao na shop stranici
export default function CheckoutPage() {
  return (
    <CartProvider>
      <div className="container mx-auto px-4 py-12">
        <CheckoutContent />
      </div>
    </CartProvider>
  )
}

