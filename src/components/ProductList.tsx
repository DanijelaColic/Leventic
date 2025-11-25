import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'
import type { Product } from '../data/products'
import ProductDetailModal from './ProductDetailModal'

export default function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  // Prikaži sve proizvode s varijantama
  const displayProducts = products.filter((p) => p.variants && p.variants.length > 0)

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div
              className="h-64 bg-primary-100 relative overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                loading="lazy"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-md">
                {product.emoji}
              </div>
            </div>
            <div className="p-6">
              <h2
                className="text-2xl font-bold text-primary-900 mb-2 cursor-pointer hover:text-primary-700 transition-colors"
                onClick={() => handleProductClick(product)}
              >
                {product.name}
              </h2>
            <p className="text-gray-600 mb-4 min-h-[60px]">
              {product.description}
            </p>
          </div>
        </div>
      ))}
      </div>
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}

