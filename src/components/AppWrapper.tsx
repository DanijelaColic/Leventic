import { useEffect, type ReactNode } from 'react'
import { CartProvider, useCart } from '../context/CartContext'
import Header from './Header'
import CartAddPopup from './CartAddPopup'

function AppContent({ children }: { children: ReactNode }) {
  const {
    showAddPopup,
    setShowAddPopup,
    lastAddedItem,
    setLastAddedItem,
    setShouldOpenCart,
  } = useCart()

  // Debug log
  useEffect(() => {
    console.log('AppWrapper: showAddPopup =', showAddPopup, 'lastAddedItem =', lastAddedItem)
  }, [showAddPopup, lastAddedItem])

  const handleClosePopup = () => {
    console.log('AppWrapper: Closing popup')
    setShowAddPopup(false)
    setLastAddedItem(null)
  }

  const handleViewCart = () => {
    console.log('AppWrapper: View cart clicked')
    setShowAddPopup(false)
    setShouldOpenCart(true)
    setLastAddedItem(null)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <CartAddPopup
        isVisible={showAddPopup}
        onClose={handleClosePopup}
        onViewCart={handleViewCart}
        addedItem={lastAddedItem}
      />
    </>
  )
}

export default function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <AppContent>{children}</AppContent>
    </CartProvider>
  )
}

