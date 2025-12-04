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

        {/* Plodovi.hr Section */}
        <div className="bg-primary-50 py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-gray-700 mb-4">
                Naše proizvode možete kupiti i na:
              </p>
              <a
                href="https://plodovi.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-2xl md:text-3xl font-bold text-primary-700 hover:text-primary-800 transition-colors"
              >
                🛒 Plodovi.hr
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
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

