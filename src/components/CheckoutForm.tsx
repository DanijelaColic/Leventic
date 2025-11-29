import { useState, FormEvent } from 'react'
import { useCart } from '../context/CartContext'
import { calculateShipping } from '../utils/shipping'
import {
  generateOrderNumber,
  saveOrder,
  type Order,
} from '../utils/orders'

interface CheckoutFormProps {
  onOrderComplete: (orderId: string) => void
}

export default function CheckoutForm({ onOrderComplete }: CheckoutFormProps) {
  const { cart, getTotalPrice, getTotalWeight, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = getTotalPrice()
  const shipping = calculateShipping(getTotalWeight())
  const total = subtotal + shipping

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Hrvatska',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Očisti grešku za ovo polje ako postoji
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ime je obavezno'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Prezime je obavezno'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email je obavezan'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nevažeća email adresa'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon je obavezan'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Adresa je obavezna'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Grad je obavezan'
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Poštanski broj je obavezan'
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Država je obavezna'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (cart.length === 0) {
      alert('Košarica je prazna')
      return
    }

    setIsSubmitting(true)

    try {
      const orderNumber = generateOrderNumber()
      // Ne spremaj # u order ID - dodaj ga samo za display
      const orderId = orderNumber
      
      console.log('CheckoutForm: Creating order with ID:', orderId)

      const order: Order = {
        id: orderId,
        orderNumber,
        customer: formData,
        items: [...cart],
        subtotal,
        shipping,
        total,
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
        paymentReference: orderNumber,
      }

      // Spremi u localStorage (za backup)
      saveOrder(order)
      console.log('CheckoutForm: Order saved to localStorage')
      
      // ✅ NOVO: Spremi narudžbu u Supabase
      try {
        const supabaseOrder = {
          order_number: `ORD-${orderNumber}`,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_city: formData.city,
          customer_postal_code: formData.postalCode,
          items: cart.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            variant: item.selectedWeight || undefined,
            quantity: item.quantity,
            price: item.product.price,
          })),
          subtotal,
          shipping_cost: shipping,
          total,
          status: 'pending',
          notes: `Država: ${formData.country}`,
        }

        const response = await fetch('/api/admin/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(supabaseOrder),
        })

        if (response.ok) {
          console.log('✅ Order successfully saved to Supabase')
        } else {
          console.error('❌ Failed to save order to Supabase')
        }
      } catch (supabaseError) {
        console.error('Error saving to Supabase:', supabaseError)
        // Ne zaustavljaj proces ako Supabase ne radi
      }
      
      clearCart()
      console.log('CheckoutForm: Cart cleared, calling onOrderComplete with orderId:', orderId)
      
      onOrderComplete(orderId)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Došlo je do greške prilikom kreiranja narudžbe. Molimo pokušajte ponovno.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">Košarica je prazna</p>
        <a
          href="/shop"
          className="text-primary-600 hover:text-primary-700 underline"
        >
          Nastavi kupovinu
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary-900 mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Forma */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Podaci za dostavu</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ime *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Prezime *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Telefon *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Adresa *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Grad *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Poštanski broj *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Država *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="Hrvatska">Hrvatska</option>
                <option value="Slovenija">Slovenija</option>
                <option value="Srbija">Srbija</option>
                <option value="Bosna i Hercegovina">
                  Bosna i Hercegovina
                </option>
                <option value="Ostalo">Ostalo</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Obrađuje se...' : 'Završi narudžbu'}
            </button>
          </form>
        </div>

        {/* Sažetak narudžbe */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Sažetak narudžbe</h2>
          
          {/* Info o načinu plaćanja */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Način plaćanja
                </h3>
                <p className="text-sm text-blue-800">
                  Plaćanje bankovnim prijenosom (uplata na račun). Nakon završetka
                  narudžbe dobit ćete sve potrebne podatke za uplatu.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-primary-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {item.product.price.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Međuzbir:</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Dostava:</span>
                <span>{shipping.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t font-bold text-lg">
                <span>Ukupno:</span>
                <span className="text-primary-600">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



