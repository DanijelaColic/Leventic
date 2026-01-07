import { CartProvider, useCart } from '../context/CartContext'
import ProductList from './ProductList'
import CartAddPopup from './CartAddPopup'

// ShopPage mora imati svoj CartProvider jer se renderira kao client:only="react"
// unutar Astro slot-a, što ne može pristupiti React contextu iz AppWrapper-a
// Košarica se i dalje dijeli kroz localStorage, tako da nema problema
function ShopPageContent() {
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
    // Pošalji custom event da se otvori košarica u AppWrapper-ovom CartProvider-u
    // jer ShopPage ima svoj CartProvider, a CartButton koristi AppWrapper-ov CartProvider
    window.dispatchEvent(new CustomEvent('openCart'))
  }

  return (
    <>
      {/* Testimonial Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="text-center md:text-left">
              <p className="font-semibold text-amber-900">
                Pogledajte preporuku <span className="text-red-600">#KuhinjaBabeEve</span>
              </p>
              <p className="text-sm text-amber-700">
                Saznajte zašto profesionalci biraju naše pirovo brašno
              </p>
            </div>
            <a
              href="https://www.youtube.com/watch?v=zdz2kcNfqMc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Pogledaj video
            </a>
          </div>
        </div>
      </div>

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

