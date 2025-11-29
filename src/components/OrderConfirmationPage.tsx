import { CartProvider, useCart } from '../context/CartContext'
import Header from './Header'
import OrderConfirmationContent from './OrderConfirmationContent'
import CartAddPopup from './CartAddPopup'

function OrderConfirmationPageContent() {
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
          <OrderConfirmationContent />
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

export default function OrderConfirmationPage() {
  return (
    <CartProvider>
      <OrderConfirmationPageContent />
    </CartProvider>
  )
}

