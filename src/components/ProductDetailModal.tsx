import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const { addToCart } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [imageZoom, setImageZoom] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Postavi prvu varijantu kao default
      if (product?.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0].weight)
      }
    } else {
      document.body.style.overflow = 'unset'
      setImageZoom(false)
      setQuantity(1)
      setSelectedImageIndex(0)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, product])

  if (!isOpen || !product) return null

  const formatText = (text?: string) => {
    if (!text) return null
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ))
  }

  const selectedVariantData = product.variants?.find(
    (v) => v.weight === selectedVariant
  )
  const currentPrice = selectedVariantData?.price || product.price

  // Koristi images array ako postoji, inače samo glavnu sliku
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image]

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageZoom) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const handleAddToCart = () => {
    if (!selectedVariant && product.variants && product.variants.length > 0) {
      alert('Molimo odaberite težinu proizvoda')
      return
    }
    
    // Kreiraj unique ID za proizvod s varijantom
    const productId = product.variants
      ? `${product.id}-${selectedVariant}`
      : product.id
    
    // Spremi informacije o varijanti u localStorage ili koristi poseban format
    addToCart(productId, quantity)
    
    // Reset
    setQuantity(1)
    alert('Proizvod je dodan u košaricu!')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900">
              {product.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Zatvori"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content - Grid Layout */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Images with Zoom (Vertical Stack) */}
              <div className="space-y-6">
                <p className="text-sm text-gray-500 text-center mb-2">
                  Hover za zumiranje slike
                </p>
                {/* All Images Stacked Vertically */}
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-full h-96 bg-primary-100 rounded-lg overflow-hidden cursor-zoom-in"
                    onMouseEnter={() => {
                      setImageZoom(true)
                      setSelectedImageIndex(index)
                    }}
                    onMouseLeave={() => setImageZoom(false)}
                    onMouseMove={(e) => {
                      if (selectedImageIndex === index) {
                        handleImageMouseMove(e)
                      }
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Slika ${index + 1}`}
                      className={`w-full h-full object-contain p-8 transition-transform duration-300 ${
                        imageZoom && selectedImageIndex === index
                          ? 'scale-150'
                          : 'scale-100'
                      }`}
                      style={
                        imageZoom && selectedImageIndex === index
                          ? {
                              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            }
                          : {}
                      }
                      loading="lazy"
                    />
                    {imageZoom && selectedImageIndex === index && (
                      <div className="absolute inset-0 pointer-events-none border-2 border-primary-500"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Side - Product Info and Add to Cart */}
              <div className="space-y-6">
                {/* Price */}
                <div className="pb-4 border-b">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary-600">
                      {currentPrice.toFixed(2)} €
                    </span>
                    {product.unit && (
                      <span className="text-lg text-gray-500">/{product.unit}</span>
                    )}
                  </div>
                </div>

                {/* Variant Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Odaberite težinu:
                    </label>
                    <div className="flex gap-3">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.weight}
                          onClick={() => setSelectedVariant(variant.weight)}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-colors ${
                            selectedVariant === variant.weight
                              ? 'border-primary-600 bg-primary-50 text-primary-900'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-primary-400'
                          }`}
                        >
                          <div>{variant.weight}</div>
                          <div className="text-sm font-normal mt-1">
                            {variant.price.toFixed(2)} €
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Količina:
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded bg-primary-200 text-primary-900 font-semibold hover:bg-primary-300 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-20 text-center border border-gray-300 rounded px-2 py-2 text-lg font-semibold"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded bg-primary-200 text-primary-900 font-semibold hover:bg-primary-300 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-lg shadow-md hover:shadow-lg"
                >
                  Dodaj u košaricu
                </button>

                {/* Description */}
                {product.detailedDescription && (
                  <div className="pt-4 border-t">
                    <h3 className="text-xl font-bold text-primary-900 mb-4">
                      Opis
                    </h3>
                    <div className="text-gray-700 leading-relaxed text-sm">
                      {formatText(product.detailedDescription)}
                    </div>
                  </div>
                )}

                {/* Usage */}
                {product.usage && (
                  <div>
                    <h3 className="text-xl font-bold text-primary-900 mb-4">
                      Način upotrebe
                    </h3>
                    <div className="text-gray-700 leading-relaxed text-sm">
                      {formatText(product.usage)}
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                {product.ingredients && (
                  <div>
                    <h3 className="text-xl font-bold text-primary-900 mb-2">
                      Sastojci
                    </h3>
                    <p className="text-gray-700 text-sm">{product.ingredients}</p>
                  </div>
                )}

                {/* Notes */}
                {product.notes && (
                  <div>
                    <h3 className="text-xl font-bold text-primary-900 mb-2">
                      Napomena
                    </h3>
                    <p className="text-gray-700 text-sm">{product.notes}</p>
                  </div>
                )}

                {/* Storage */}
                {product.storage && (
                  <div>
                    <h3 className="text-xl font-bold text-primary-900 mb-2">
                      Uvjeti čuvanja
                    </h3>
                    <p className="text-gray-700 text-sm">{product.storage}</p>
                  </div>
                )}

                {/* Expiry */}
                {product.expiry && (
                  <div>
                    <h3 className="text-xl font-bold text-primary-900 mb-2">
                      Rok upotrebe
                    </h3>
                    <p className="text-gray-700 text-sm">{product.expiry}</p>
                  </div>
                )}

                {/* Nutrition Info */}
                {product.nutrition && (
                  <div>
                    <h3 className="text-xl font-bold text-primary-900 mb-4">
                      Nutritivna vrijednost
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <tbody className="text-gray-700">
                          <tr className="border-b">
                            <td className="py-2 pr-4 font-semibold">
                              Energetska vrijednost
                            </td>
                            <td className="py-2">{product.nutrition.energy}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 pr-4 font-semibold">Masti</td>
                            <td className="py-2">{product.nutrition.fat}</td>
                          </tr>
                          {product.nutrition.saturatedFat && (
                            <tr className="border-b">
                              <td className="py-2 pr-4 pl-4 text-xs">
                                od kojih zasićene masne kiseline
                              </td>
                              <td className="py-2">
                                {product.nutrition.saturatedFat}
                              </td>
                            </tr>
                          )}
                          <tr className="border-b">
                            <td className="py-2 pr-4 font-semibold">
                              Ugljikohidrati
                            </td>
                            <td className="py-2">{product.nutrition.carbs}</td>
                          </tr>
                          {product.nutrition.sugars && (
                            <tr className="border-b">
                              <td className="py-2 pr-4 pl-4 text-xs">
                                od kojih šećeri
                              </td>
                              <td className="py-2">{product.nutrition.sugars}</td>
                            </tr>
                          )}
                          {product.nutrition.fiber && (
                            <tr className="border-b">
                              <td className="py-2 pr-4 font-semibold">Vlakna</td>
                              <td className="py-2">{product.nutrition.fiber}</td>
                            </tr>
                          )}
                          <tr className="border-b">
                            <td className="py-2 pr-4 font-semibold">
                              Bjelančevine
                            </td>
                            <td className="py-2">{product.nutrition.protein}</td>
                          </tr>
                          {product.nutrition.salt && (
                            <tr>
                              <td className="py-2 pr-4 font-semibold">Soli</td>
                              <td className="py-2">{product.nutrition.salt}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
