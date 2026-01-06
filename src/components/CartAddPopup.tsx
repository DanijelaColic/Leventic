import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import type { CartItem } from '../context/CartContext'

interface CartAddPopupProps {
  isVisible: boolean
  onClose: () => void
  onViewCart: () => void
  addedItem: CartItem | null
}

export default function CartAddPopup({
  isVisible,
  onClose,
  onViewCart,
  addedItem,
}: CartAddPopupProps) {
  const { cart, updateQuantity } = useCart()

  // Pronađi trenutni item u košarici (može se razlikovati od addedItem ako je količina promijenjena)
  const currentCartItem = addedItem
    ? cart.find((item) => item.product.id === addedItem.product.id) || addedItem
    : null

  useEffect(() => {
    if (isVisible && addedItem) {
      console.log('CartAddPopup: Showing popup for', addedItem.product.name)
      console.log('CartAddPopup: isVisible =', isVisible, 'addedItem =', addedItem)
    }
  }, [isVisible, addedItem])

  if (!isVisible || !addedItem || !currentCartItem) {
    console.log('CartAddPopup: Not rendering - isVisible:', isVisible, 'addedItem:', addedItem)
    return null
  }

  console.log('CartAddPopup: Rendering popup')

  const handleIncreaseQuantity = () => {
    updateQuantity(currentCartItem.product.id, currentCartItem.quantity + 1)
  }

  const handleDecreaseQuantity = () => {
    if (currentCartItem.quantity > 1) {
      updateQuantity(currentCartItem.product.id, currentCartItem.quantity - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 pointer-events-auto"
        onClick={onClose}
      />
      {/* Popup */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 pointer-events-auto animate-slide-in-left">
        <div className="bg-white rounded-lg shadow-2xl border-2 border-primary-200 min-w-[320px] max-w-md">
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="font-bold text-lg">Proizvod dodan!</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Zatvori"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-b from-primary-50 to-white p-1 border border-gray-100">
              <img
                src={currentCartItem.product.image}
                alt={currentCartItem.product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-lg text-primary-900 mb-1 truncate">
                {currentCartItem.product.name}
              </h4>
              {/* Količina s +/- gumbovima */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-600">Količina:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDecreaseQuantity}
                    disabled={currentCartItem.quantity <= 1}
                    className="w-8 h-8 rounded bg-primary-200 text-primary-900 font-semibold hover:bg-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Smanji količinu"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">
                    {currentCartItem.quantity}
                  </span>
                  <button
                    onClick={handleIncreaseQuantity}
                    className="w-8 h-8 rounded bg-primary-200 text-primary-900 font-semibold hover:bg-primary-300 transition-colors flex items-center justify-center"
                    aria-label="Povećaj količinu"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600 ml-1">
                    {currentCartItem.product.unit}
                  </span>
                </div>
              </div>
              <p className="text-lg font-bold text-primary-600">
                {(currentCartItem.product.price * currentCartItem.quantity).toFixed(2)} €
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onViewCart}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Idi u košaricu za kupnju
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Nastavi s kupnjom
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

