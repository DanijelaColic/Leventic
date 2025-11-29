import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'
import type { Product } from '../data/products'
import ProductDetailModal from './ProductDetailModal'

export default function ProductList() {
  const { addToCart } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Debug log
  console.log('ProductList: Rendering with', products.length, 'products')

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleQuickAdd = (
    e: React.MouseEvent,
    product: Product,
    variant?: string
  ) => {
    e.stopPropagation() // Spriječi otvaranje modala

    // Ako proizvod ima više varijanti, otvori modal za odabir
    if (product.variants && product.variants.length > 1) {
      handleProductClick(product)
      return
    }

    // Ako ima samo jednu varijantu ili nema varijanti, dodaj direktno u košaricu
    if (product.variants && product.variants.length === 1) {
      // Koristi prvu (i jedinu) varijantu
      const productId = `${product.id}-${product.variants[0].weight}`
      addToCart(productId, 1)
      return
    }

    // Ako nema varijanti, dodaj direktno u košaricu
    addToCart(product.id, 1)
  }

  // Prikaži sve proizvode (s varijantama i bez)
  const displayProducts = products

  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nema dostupnih proizvoda.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {displayProducts.map((product) => {
          const minPrice = product.variants
            ? Math.min(...product.variants.map((v) => v.price))
            : product.price
          
          const hasMultipleVariants =
            product.variants && product.variants.length > 1

          return (
          <div
            key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
          >
            <div
              className="h-64 bg-white relative overflow-hidden flex items-center justify-center cursor-pointer border-b border-gray-100"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-md">
                {product.emoji}
              </div>
            </div>
              <div className="p-6 flex flex-col flex-1">
              <h2
                className="text-2xl font-bold text-primary-900 mb-2 cursor-pointer hover:text-primary-700 transition-colors"
                onClick={() => handleProductClick(product)}
              >
                {product.name}
              </h2>
                <p className="text-gray-600 mb-4 min-h-[60px] flex-1">
              {product.description}
            </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                  <div>
                    {hasMultipleVariants ? (
                      <span className="text-2xl font-bold text-primary-600">
                        od {minPrice.toFixed(2)} €
                      </span>
                    ) : (
                      <span className="text-2xl font-bold text-primary-600">
                        {minPrice.toFixed(2)} €
                      </span>
                    )}
                    {product.unit && (
                      <span className="text-sm text-gray-500">/{product.unit}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
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
                    Dodaj
                  </button>
                </div>
          </div>
        </div>
          )
        })}
      </div>
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}

