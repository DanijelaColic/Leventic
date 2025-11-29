import { CartProvider } from '../context/CartContext'
import Header from './Header'
import ProductList from './ProductList'
import CartAddPopup from './CartAddPopup'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'

function ShopPageContent() {
  const {
    showAddPopup,
    setShowAddPopup,
    lastAddedItem,
    setLastAddedItem,
    setShouldOpenCart,
  } = useCart()

  useEffect(() => {
    console.log('ShopPage: showAddPopup =', showAddPopup)
  }, [showAddPopup])

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
          <ProductList />
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

export default function ShopPage() {
  return (
    <CartProvider>
      <ShopPageContent />
    </CartProvider>
  )
}

