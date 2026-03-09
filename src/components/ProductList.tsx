import { useState, useEffect, useCallback } from 'react'
import { useCart } from '../context/CartContext'
import { products as staticProducts } from '../data/products'
import type { Product } from '../data/products'
import ProductDetailModal from './ProductDetailModal'

export default function ProductList() {
  const { addToCart, shouldOpenCart, setShouldOpenCart } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>(staticProducts)
  const [loading, setLoading] = useState(true)

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const apiProducts = await response.json()
          if (apiProducts.length > 0) {
            // Convert API products to match Product interface
            const convertedProducts: Product[] = apiProducts.map((p: any) => ({
              id: p.id.toString(),
              name: p.name,
              description: p.description,
              price: p.price,
              unit: p.unit || 'kom',
              emoji: p.emoji || '🌾',
              image: p.image,
              images: p.images || undefined,
              variants: p.variants || undefined,
              detailedDescription: p.detailed_description || undefined,
              usage: p.usage || undefined,
              ingredients: p.ingredients || undefined,
              notes: p.notes || undefined,
              storage: p.storage || undefined,
              expiry: p.expiry || undefined,
              nutrition: p.nutrition || undefined,
              available: p.available !== false, // Default true ako nije postavljeno
            }))
            setProducts(convertedProducts)
            console.log('ProductList: Loaded', convertedProducts.length, 'products from API')
          } else {
            console.log('ProductList: No products in API, using static products')
          }
        } else {
          console.warn('ProductList: API failed, using static products')
        }
      } catch (error) {
        console.error('ProductList: Error loading products:', error)
        console.log('ProductList: Using static products as fallback')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Debug log
  console.log('ProductList: Rendering with', products.length, 'products')

  // Zatvori ProductDetailModal kada se otvara košarica
  // Ali samo ako je modal već otvoren - ne sprječavaj otvaranje modala
  // Također, resetiraj shouldOpenCart flag kada se modal otvori da se izbjegne zatvaranje
  useEffect(() => {
    if (shouldOpenCart && isModalOpen) {
      console.log('ProductList: Closing modal because cart is opening')
      setIsModalOpen(false)
      setSelectedProduct(null)
      setShouldOpenCart(false) // Reset flag nakon zatvaranja modala
    }
  }, [shouldOpenCart, isModalOpen, setShouldOpenCart])
  
  // Resetiraj shouldOpenCart flag kada se modal otvori da se izbjegne zatvaranje
  useEffect(() => {
    if (isModalOpen && shouldOpenCart) {
      console.log('ProductList: Modal opened but shouldOpenCart is true, resetting flag')
      setShouldOpenCart(false)
    }
  }, [isModalOpen, shouldOpenCart, setShouldOpenCart])

  // Auto-otvori proizvod ako je proslijeđen preko URL parametra
  // Čeka da se proizvodi učitaju prije provjere URL parametra
  useEffect(() => {
    if (loading) return // Čekaj da se proizvodi učitaju
    
    const urlParams = new URLSearchParams(window.location.search)
    const productId = urlParams.get('product')
    if (productId) {
      const product = products.find(p => p.id === productId)
      if (product) {
        setSelectedProduct(product)
        setIsModalOpen(true)
        // Očisti URL parametar
        window.history.replaceState({}, '', '/shop')
      }
    }
  }, [products, loading])

  const handleProductClick = useCallback((product: Product) => {
    console.log('ProductList: handleProductClick called', product.id, product.name)
    if (!product) {
      console.error('ProductList: handleProductClick - product is null')
      return
    }
    console.log('ProductList: Setting selectedProduct and opening modal')
    // Resetiraj shouldOpenCart flag prije otvaranja modala da se izbjegne zatvaranje
    setShouldOpenCart(false)
    // Koristi funkcijski update da se osigura da se state ažurira ispravno
    setSelectedProduct(() => product)
    setIsModalOpen(() => true)
    console.log('ProductList: State updated - selectedProduct:', product.id, 'isModalOpen: true')
  }, [setShouldOpenCart])
  
  // Debug log za praćenje state promjena
  useEffect(() => {
    console.log('ProductList: State changed - isModalOpen:', isModalOpen, 'selectedProduct:', selectedProduct?.id, selectedProduct?.name)
  }, [isModalOpen, selectedProduct])

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
      addToCart(productId, 1, product)
      return
    }

    // Ako nema varijanti, dodaj direktno u košaricu
    addToCart(product.id, 1, product)
  }

  // Prikaži sve proizvode sortirane po ID-u (željeni redoslijed)
  const displayProducts = [...products].sort((a, b) => {
    // Sortiraj po numeričkom ID-u za pravilno poredanje
    return parseInt(a.id) - parseInt(b.id)
  })

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">Učitavanje proizvoda...</p>
      </div>
    )
  }

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
              className="h-64 bg-gradient-to-b from-primary-50 to-white relative overflow-hidden flex items-center justify-center cursor-pointer border-b border-gray-100 p-4"
              onClick={() => handleProductClick(product)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleProductClick(product)
                }
              }}
              aria-label={`Pogledaj detalje o ${product.name}`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300 pointer-events-none"
                loading="lazy"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-md pointer-events-none">
                {product.emoji}
              </div>
            </div>
              <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2
                  className="text-2xl font-bold text-primary-900 cursor-pointer hover:text-primary-700 transition-colors"
                  onClick={() => handleProductClick(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleProductClick(product)
                    }
                  }}
                  aria-label={`Pogledaj detalje o ${product.name}`}
                >
                  {product.name}
                </h2>
                {product.available === false && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                    Nedostupan
                  </span>
                )}
              </div>
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
                  {product.available === false ? (
                    <button
                      disabled
                      className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold cursor-not-allowed flex items-center gap-2"
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
                      Nedostupan
                    </button>
                  ) : (
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
                  )}
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

