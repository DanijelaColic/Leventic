'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { products } from '@/data/products'

export default function ShopPage() {
  const { addToCart } = useCart()
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, value),
    }))
  }

  const handleAddToCart = (productId: string) => {
    const quantity = quantities[productId] || 1
    addToCart(productId, quantity)
    setQuantities((prev) => ({ ...prev, [productId]: 1 }))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-12 text-center">
        Naši proizvodi
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="h-64 bg-primary-100 flex items-center justify-center">
              <span className="text-6xl">{product.emoji}</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-primary-900 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-4 min-h-[60px]">
                {product.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {product.price.toFixed(2)} €
                </span>
                {product.unit && (
                  <span className="text-sm text-gray-500">/{product.unit}</span>
                )}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm text-gray-700">Količina:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.id,
                        (quantities[product.id] || 1) - 1
                      )
                    }
                    className="w-8 h-8 rounded bg-primary-200 text-primary-900 font-semibold hover:bg-primary-300 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(
                        product.id,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.id,
                        (quantities[product.id] || 1) + 1
                      )
                    }
                    className="w-8 h-8 rounded bg-primary-200 text-primary-900 font-semibold hover:bg-primary-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Dodaj u košaricu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

