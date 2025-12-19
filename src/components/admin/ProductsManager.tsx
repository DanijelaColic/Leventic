import React, { useState, useEffect } from 'react'
import type { DbProduct } from '../../lib/supabase'
import type { Product } from '../../data/products'
import MultipleImageUpload from './MultipleImageUpload'
import ProductDetailModal from '../ProductDetailModal'
import { CartProvider } from '../../context/CartContext'

export default function ProductsManager() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Učitavanje proizvoda
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (product: Partial<DbProduct>) => {
    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products'

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      if (response.ok) {
        await loadProducts()
        setShowModal(false)
        setEditingProduct(null)
      } else {
        // Prikaži grešku korisniku
        const errorData = await response.json().catch(() => ({ error: 'Nepoznata greška' }))
        alert(`Greška pri spremanju proizvoda: ${errorData.error || 'Nepoznata greška'}`)
        console.error('Error saving product:', response.status, errorData)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert(`Greška pri spremanju proizvoda: ${error instanceof Error ? error.message : 'Nepoznata greška'}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovaj proizvod?')) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  // Konvertiraj DbProduct u Product format za preview
  const convertToProduct = (dbProduct: DbProduct): Product => {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description,
      price: dbProduct.price,
      unit: dbProduct.unit,
      emoji: dbProduct.emoji,
      image: dbProduct.image,
      images: dbProduct.images,
      variants: dbProduct.variants,
      detailedDescription: dbProduct.detailed_description,
      usage: dbProduct.usage,
      ingredients: dbProduct.ingredients,
      notes: dbProduct.notes,
      storage: dbProduct.storage,
      expiry: dbProduct.expiry,
      nutrition: dbProduct.nutrition,
      available: dbProduct.available !== false, // Default true ako nije postavljeno
    }
  }

  const handlePreview = (product: DbProduct) => {
    const convertedProduct = convertToProduct(product)
    setPreviewProduct(convertedProduct)
    setShowPreview(true)
  }

  if (loading) {
    return <div className="text-center py-12">Učitavanje proizvoda...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upravljanje proizvodima</h2>
        <button
          onClick={() => {
            setEditingProduct(null)
            setShowModal(true)
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          + Dodaj proizvod
        </button>
      </div>

      {/* Tablica proizvoda */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proizvod
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cijena
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{product.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.available === false && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Nedostupan
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.description.substring(0, 50)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handlePreview(product)}
                    className="text-green-600 hover:text-green-900 mr-4"
                    title="Pregled proizvoda"
                  >
                    Pregled
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(product)
                      setShowModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Uredi
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal za dodavanje/uređivanje */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false)
            setEditingProduct(null)
          }}
        />
      )}

      {/* Preview modal - omotano u CartProvider jer ProductDetailModal koristi useCart */}
      {showPreview && previewProduct && (
        <CartProvider>
          <ProductDetailModal
            product={previewProduct}
            isOpen={showPreview}
            onClose={() => {
              setShowPreview(false)
              setPreviewProduct(null)
            }}
          />
        </CartProvider>
      )}
    </div>
  )
}

// Modal komponenta za dodavanje/uređivanje proizvoda
function ProductModal({
  product,
  onSave,
  onClose,
}: {
  product: DbProduct | null
  onSave: (product: Partial<DbProduct>) => void
  onClose: () => void
}) {
  // Kombiniraj image i images u jedan array za komponentu
  const getInitialImages = (prod: DbProduct | null): string[] => {
    if (!prod) return []
    const images: string[] = []
    if (prod.image) images.push(prod.image)
    if (prod.images && Array.isArray(prod.images)) {
      images.push(...prod.images)
    }
    return images
  }

  const [allImages, setAllImages] = useState<string[]>(getInitialImages(product))
  const [formData, setFormData] = useState<Partial<DbProduct>>(
    product || {
      name: '',
      description: '',
      price: 0,
      unit: 'kg',
      emoji: '🌾',
      image: '',
      detailed_description: '',
      usage: '',
      ingredients: '',
      notes: '',
      storage: '',
      expiry: '',
      available: true,
      nutrition: {
        energy: '',
        fat: '',
        carbs: '',
        protein: '',
      },
    }
  )

  // Ažuriraj formData kada se product promijeni
  useEffect(() => {
    if (product) {
      // Osiguraj da nutrition objekt postoji (ako nema ili je null, inicijaliziraj prazan)
      const productData = {
        ...product,
        // Osiguraj da available ima vrijednost
        // VAŽNO: Sačuvaj stvarnu vrijednost iz baze (false ostaje false, true ostaje true)
        // Ako je null ili undefined, postavi na true (default)
        available: product.available === false 
          ? false 
          : product.available === true 
          ? true 
          : product.available === null 
          ? true 
          : true, // undefined ili bilo što drugo -> true
        nutrition: product.nutrition && Object.keys(product.nutrition).length > 0
          ? product.nutrition
          : {
              energy: '',
              fat: '',
              carbs: '',
              protein: '',
            },
      }
      console.log('Loading product - available value:', product.available, 'converted to:', productData.available)
      setFormData(productData)
      setAllImages(getInitialImages(product))
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        unit: 'kg',
        emoji: '🌾',
        image: '',
        detailed_description: '',
        usage: '',
        ingredients: '',
        notes: '',
        storage: '',
        expiry: '',
        available: true,
        nutrition: {
          energy: '',
          fat: '',
          carbs: '',
          protein: '',
        },
      })
      setAllImages([])
    }
  }, [product])

  const handleImagesChange = (images: string[]) => {
    setAllImages(images)
    // Prva slika je glavna (image), ostale idu u images array
    const mainImage = images.length > 0 ? images[0] : ''
    const additionalImages = images.length > 1 ? images.slice(1) : []
    setFormData({
      ...formData,
      image: mainImage,
      images: additionalImages.length > 0 ? additionalImages : undefined,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Provjeri obavezna polja
    if (!formData.name || !formData.description || formData.price === undefined || !formData.emoji || !formData.image) {
      alert('Molimo popunite sva obavezna polja (Naziv, Opis, Cijena, Emoji, Slika)')
      return
    }

    // Osiguraj da je image postavljen ako postoje slike
    const finalData: any = { ...formData }
    if (allImages.length > 0 && !finalData.image) {
      finalData.image = allImages[0]
      finalData.images = allImages.length > 1 ? allImages.slice(1) : undefined
    }

    // Provjeri da li nutrition objekt ima podatke
    // Provjeri sva polja (uključujući opcionalna) da li imaju vrijednosti
    if (finalData.nutrition) {
      const nutritionObj = finalData.nutrition as any
      const hasNutritionData = Object.keys(nutritionObj).some(
        (key) => {
          const value = nutritionObj[key]
          return value && value.toString().trim() !== ''
        }
      )
      
      if (!hasNutritionData) {
        // Postavi na null da se eksplicitno obriše iz baze
        finalData.nutrition = null
      }
    } else if (product?.nutrition) {
      // Ako nutrition objekt ne postoji u formData, ali postoji u originalnom proizvodu,
      // to znači da je korisnik obrisao sve vrijednosti - postavi na null
      finalData.nutrition = null
    }

    // Osiguraj da available ima vrijednost (default true ako nije postavljeno)
    // VAŽNO: Eksplicitno postavi available kao boolean, ali sačuvaj vrijednost
    if (finalData.available === undefined || finalData.available === null) {
      finalData.available = true
    } else {
      // Osiguraj da je boolean (ne string ili drugi tip)
      finalData.available = Boolean(finalData.available)
    }

    // Privremeno: ako se dogodi greška s available kolonom, ukloni je iz podataka
    // Ovo će se automatski riješiti kada se Supabase schema cache osvježi
    const dataToSend = { ...finalData }
    
    console.log('Saving product - available value:', dataToSend.available, 'type:', typeof dataToSend.available)
    onSave(dataToSend)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {product ? 'Uredi proizvod' : 'Dodaj novi proizvod'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naziv proizvoda
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opis
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detaljni opis
                <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
              </label>
              <textarea
                value={formData.detailed_description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    detailed_description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={5}
                placeholder="Detaljni opis proizvoda koji se prikazuje kada korisnik klikne na proizvod..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Osnovna cijena (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emoji
                </label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) =>
                    setFormData({ ...formData, emoji: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available !== false}
                  onChange={(e) =>
                    setFormData({ ...formData, available: e.target.checked })
                  }
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Proizvod je dostupan
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Ako nije označeno, proizvod će biti prikazan s oznakom "Nedostupan" i neće se moći dodati u košaricu
              </p>
            </div>

            <MultipleImageUpload
              currentImages={allImages}
              onImagesChange={handleImagesChange}
            />

            {/* Dodatni elementi proizvoda */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Dodatne informacije
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Način upotrebe
                    <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
                  </label>
                  <textarea
                    value={formData.usage || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usage: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                    placeholder="Opis načina upotrebe proizvoda..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sastojci
                    <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
                  </label>
                  <textarea
                    value={formData.ingredients || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ingredients: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Popis sastojaka proizvoda..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Napomena
                    <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={2}
                    placeholder="Dodatne napomene o proizvodu..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uvjeti čuvanja
                    <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.storage || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        storage: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Npr. Čuvati na suhom, hladnom i tamnom mjestu."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rok upotrebe
                    <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.expiry || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expiry: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Npr. Istaknut na pakiranju."
                  />
                </div>
              </div>
            </div>

            {/* Nutritivne informacije */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Nutritivne informacije
                <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
              </h4>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Energetska vrijednost *
                    </label>
                    <input
                      type="text"
                      value={formData.nutrition?.energy || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nutrition: {
                            ...formData.nutrition,
                            energy: e.target.value,
                            fat: formData.nutrition?.fat || '',
                            carbs: formData.nutrition?.carbs || '',
                            protein: formData.nutrition?.protein || '',
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Npr. 1412 kJ / 334 kcal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Masti *
                    </label>
                    <input
                      type="text"
                      value={formData.nutrition?.fat || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nutrition: {
                            ...formData.nutrition,
                            energy: formData.nutrition?.energy || '',
                            fat: e.target.value,
                            carbs: formData.nutrition?.carbs || '',
                            protein: formData.nutrition?.protein || '',
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Npr. 2,26 g"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Od kojih zasićene masne kiseline
                    <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nutrition?.saturatedFat || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrition: {
                          ...formData.nutrition,
                          energy: formData.nutrition?.energy || '',
                          fat: formData.nutrition?.fat || '',
                          saturatedFat: e.target.value,
                          carbs: formData.nutrition?.carbs || '',
                          protein: formData.nutrition?.protein || '',
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Npr. 0,51 g"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ugljikohidrati *
                    </label>
                    <input
                      type="text"
                      value={formData.nutrition?.carbs || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nutrition: {
                            ...formData.nutrition,
                            energy: formData.nutrition?.energy || '',
                            fat: formData.nutrition?.fat || '',
                            carbs: e.target.value,
                            protein: formData.nutrition?.protein || '',
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Npr. 62,47 g"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Od kojih šećeri
                      <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nutrition?.sugars || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nutrition: {
                            ...formData.nutrition,
                            energy: formData.nutrition?.energy || '',
                            fat: formData.nutrition?.fat || '',
                            carbs: formData.nutrition?.carbs || '',
                            sugars: e.target.value,
                            protein: formData.nutrition?.protein || '',
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Npr. 3,04 g"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vlakna
                    <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nutrition?.fiber || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrition: {
                          ...formData.nutrition,
                          energy: formData.nutrition?.energy || '',
                          fat: formData.nutrition?.fat || '',
                          carbs: formData.nutrition?.carbs || '',
                          fiber: e.target.value,
                          protein: formData.nutrition?.protein || '',
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Npr. 5,93 g"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bjelančevine *
                    </label>
                    <input
                      type="text"
                      value={formData.nutrition?.protein || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nutrition: {
                            ...formData.nutrition,
                            energy: formData.nutrition?.energy || '',
                            fat: formData.nutrition?.fat || '',
                            carbs: formData.nutrition?.carbs || '',
                            protein: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Npr. 12,9 g"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Soli
                      <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nutrition?.salt || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nutrition: {
                            ...formData.nutrition,
                            energy: formData.nutrition?.energy || '',
                            fat: formData.nutrition?.fat || '',
                            carbs: formData.nutrition?.carbs || '',
                            protein: formData.nutrition?.protein || '',
                            salt: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Npr. < 0,01 g"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Odustani
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Spremi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

