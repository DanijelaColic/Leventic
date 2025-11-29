import { CartProvider, useCart } from '../context/CartContext'
import Header from './Header'
import CheckoutContent from './CheckoutContent'
import CartAddPopup from './CartAddPopup'
import { useEffect } from 'react'

function CheckoutPageContent() {
  const {
    showAddPopup,
    setShowAddPopup,
    lastAddedItem,
    setLastAddedItem,
    setShouldOpenCart,
  } = useCart()

  const handleClosePopup = () => {
    setShowAddPopup(false)
    setLastAddedItem(null)
  }

  const handleViewCart = () => {
    setShowAddPopup(false)
    setShouldOpenCart(true)
    setLastAddedItem(null)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <CheckoutContent />
        </div>
      </main>
      <CartAddPopup
        isVisible={showAddPopup}
        onClose={handleClosePopup}
        onViewCart={handleViewCart}
        addedItem={lastAddedItem}
      />
    </>
  )
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutPageContent />
    </CartProvider>
  )
}

