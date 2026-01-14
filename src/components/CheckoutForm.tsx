import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useCart } from '../context/CartContext'
import { calculateShippingSync, calculateShipping } from '../utils/shipping'
import {
  generateOrderNumber,
  saveOrder,
  type Order,
  type DeliveryMethod,
} from '../utils/orders'

interface CheckoutFormProps {
  onOrderComplete: (orderId: string) => void
}

// Adresa za osobno preuzimanje
const PICKUP_ADDRESS = {
  name: 'OPG Mario Leventić',
  address: 'Osječka 120',
  city: 'Čepin',
  postalCode: '31431',
  phone: '+385 91 736 9919',
}

export default function CheckoutForm({ onOrderComplete }: CheckoutFormProps) {
  const { cart, getTotalPrice, getTotalWeight, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery')
  const [shippingCost, setShippingCost] = useState(0)

  // Učitaj postavke dostave i izračunaj cijenu
  useEffect(() => {
    const loadShippingCost = async () => {
      if (deliveryMethod === 'pickup') {
        setShippingCost(0)
        return
      }
      const totalWeight = getTotalWeight()
      const cost = await calculateShipping(totalWeight)
      setShippingCost(cost)
    }
    loadShippingCost()
  }, [deliveryMethod, cart])

  const subtotal = getTotalPrice()
  // Dostava je 0 € za osobno preuzimanje
  const shipping = deliveryMethod === 'pickup' ? 0 : shippingCost
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
    needsR1Invoice: false,
    companyName: '',
    companyOIB: '',
    companyAddress: '',
    customerNotes: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
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

    // Adresna polja su obavezna samo za dostavu
    if (deliveryMethod === 'delivery') {
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
    }

    // Polja za R1 račun su obavezna ako je checkbox označen
    if (formData.needsR1Invoice) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Naziv tvrtke je obavezan'
      }
      if (!formData.companyOIB.trim()) {
        newErrors.companyOIB = 'OIB je obavezan'
      } else if (!/^\d{11}$/.test(formData.companyOIB.trim())) {
        newErrors.companyOIB = 'OIB mora imati točno 11 znamenki'
      }
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

      // Za osobno preuzimanje, koristi adresu preuzimanja u customer podatcima
      const customerData = deliveryMethod === 'pickup'
        ? {
            ...formData,
            address: PICKUP_ADDRESS.address,
            city: PICKUP_ADDRESS.city,
            postalCode: PICKUP_ADDRESS.postalCode,
            country: 'Hrvatska',
          }
        : formData

      const order: Order = {
        id: orderId,
        orderNumber,
        customer: customerData,
        items: [...cart],
        subtotal,
        shipping,
        total,
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
        paymentReference: orderNumber,
        deliveryMethod,
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
          customer_address: customerData.address,
          customer_city: customerData.city,
          customer_postal_code: customerData.postalCode,
          items: cart.map((item) => {
            // Izvuci varijantu iz product.id (format: "productId-variant" ili samo "productId")
            const productIdParts = item.product.id.split('-')
            const variant = productIdParts.length > 1 ? productIdParts[1] : undefined
            
            return {
              productId: productIdParts[0],
              productName: item.product.name,
              variant: variant,
              quantity: item.quantity,
              price: item.product.price,
            }
          }),
          subtotal,
          shipping_cost: shipping,
          total,
          status: 'pending',
          notes: (() => {
            let notes = deliveryMethod === 'pickup' 
              ? '🏠 OSOBNO PREUZIMANJE' 
              : `📦 DOSTAVA - Država: ${formData.country}`
            
            // Dodaj informacije o R1 računu ako je potreban
            if (formData.needsR1Invoice) {
              notes += '\n\n🧾 R1 RAČUN:'
              notes += `\nNaziv tvrtke: ${formData.companyName}`
              notes += `\nOIB: ${formData.companyOIB}`
              if (formData.companyAddress.trim()) {
                notes += `\nAdresa firme: ${formData.companyAddress}`
              }
            }
            
            // Dodaj napomene kupca ako postoje
            if (formData.customerNotes.trim()) {
              notes += '\n\n📝 NAPOMENE KUPCA:'
              notes += `\n${formData.customerNotes.trim()}`
            }
            
            return notes
          })(),
        }

        const response = await fetch('/api/admin/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(supabaseOrder),
        })

        if (response.ok) {
          const savedOrder = await response.json()
          console.log('✅ Order successfully saved to Supabase:', savedOrder.id)
        } else {
          const errorData = await response.json()
          console.error('❌ Failed to save order to Supabase:', errorData)
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
          <h2 className="text-2xl font-semibold mb-6">Podaci za narudžbu</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Odabir načina preuzimanja */}
            <div className="bg-gray-50 rounded-lg p-4 mb-2">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Način preuzimanja *
              </p>
              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="delivery"
                    checked={deliveryMethod === 'delivery'}
                    onChange={() => setDeliveryMethod('delivery')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        📦 Dostava na adresu
                      </span>
                      <span className="text-sm font-medium text-primary-600">
                        {shippingCost.toFixed(2)} €
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Dostava na vašu adresu unutar 2-5 radnih dana
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => setDeliveryMethod('pickup')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        🏠 Osobno preuzimanje
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        Besplatno
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {PICKUP_ADDRESS.name}, {PICKUP_ADDRESS.address}, {PICKUP_ADDRESS.city}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Checkbox za R1 račun */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="needsR1Invoice"
                  checked={formData.needsR1Invoice}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Potrebam R1 račun
                </span>
              </label>
            </div>

            {/* Polja za R1 račun - prikazuju se samo ako je checkbox označen */}
            {formData.needsR1Invoice && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">🧾</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Podaci za R1 račun
                    </h3>
                    <p className="text-sm text-blue-700">
                      Unesite podatke tvrtke za izdavanje R1 računa
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Naziv tvrtke/pravne osobe *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Npr. OPG Ime Prezime d.o.o."
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="companyOIB"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    OIB *
                  </label>
                  <input
                    type="text"
                    id="companyOIB"
                    name="companyOIB"
                    value={formData.companyOIB}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.companyOIB ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="12345678901"
                    maxLength={11}
                  />
                  {errors.companyOIB && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyOIB}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="companyAddress"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Adresa firme
                    <span className="text-xs text-gray-500 ml-2">
                      (opcionalno, ako je drugačija od adrese dostave)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="companyAddress"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ulica i broj, grad"
                  />
                </div>
              </div>
            )}

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

            {/* Adresna polja - prikazuju se samo za dostavu */}
            {deliveryMethod === 'delivery' && (
              <>
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
              </>
            )}

            {/* Info za osobno preuzimanje */}
            {deliveryMethod === 'pickup' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <p className="font-semibold text-green-900">
                      Adresa za preuzimanje
                    </p>
                    <p className="font-medium text-green-800 mt-1">
                      {PICKUP_ADDRESS.name}
                    </p>
                    <p className="text-green-800">
                      {PICKUP_ADDRESS.address}<br />
                      {PICKUP_ADDRESS.postalCode} {PICKUP_ADDRESS.city}
                    </p>
                    <p className="text-green-800 mt-1">
                      Tel: {PICKUP_ADDRESS.phone}
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                      Kontaktirat ćemo vas nakon uplate radi dogovora termina preuzimanja.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Polje za dodatne napomene */}
            <div>
              <label
                htmlFor="customerNotes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dodatne napomene
                <span className="text-xs text-gray-500 ml-2">(opcionalno)</span>
              </label>
              <textarea
                id="customerNotes"
                name="customerNotes"
                value={formData.customerNotes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Npr. posebne upute za dostavu, kontakt prije dostave, hitna narudžba, itd."
              />
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
                <span>
                  {deliveryMethod === 'pickup' ? 'Osobno preuzimanje:' : 'Dostava:'}
                </span>
                <span className={deliveryMethod === 'pickup' ? 'text-green-600 font-medium' : ''}>
                  {deliveryMethod === 'pickup' ? 'Besplatno' : `${shipping.toFixed(2)} €`}
                </span>
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



