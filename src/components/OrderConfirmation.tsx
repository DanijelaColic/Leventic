import { useEffect, useState } from 'react'
import { getOrderById, type Order } from '../utils/orders'

interface OrderConfirmationProps {
  orderId: string
}

export default function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // OrderID više ne sadrži #, dohvati direktno
    const foundOrder = getOrderById(orderId)
    setOrder(foundOrder)
    setLoading(false)

    // Pošalji email potvrdu kroz Resend API
    if (foundOrder) {
      sendOrderConfirmationEmail(foundOrder)
    }
  }, [orderId])

  const sendOrderConfirmationEmail = async (order: Order) => {
    try {
      const response = await fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Failed to send email:', error)
        // Ne prikazuj grešku korisniku, samo logiraj
      } else {
        const result = await response.json()
        console.log('Email sent successfully:', result)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      // Ne prikazuj grešku korisniku, samo logiraj
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Učitavanje...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600 mb-4">
          Narudžba nije pronađena
        </p>
        <a
          href="/shop"
          className="text-primary-600 hover:text-primary-700 underline"
        >
          Povratak na shop
        </a>
      </div>
    )
  }

  // Bankovni podaci
  const bankDetails = {
    iban: 'HR6225000093120447816',
    recipient: 'Mario Leventić',
    model: 'HR00',
    paymentDeadline: 7, // dani
    contactEmail: 'info@eko-leventic.hr',
    contactPhone: '+385 91 736 9919',
  }

  // Izračunaj rok za uplatu
  const paymentDeadlineDate = new Date(order.createdAt)
  paymentDeadlineDate.setDate(paymentDeadlineDate.getDate() + bankDetails.paymentDeadline)
  const formattedDeadline = paymentDeadlineDate.toLocaleDateString('hr-HR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h1 className="text-2xl font-bold text-green-900">
              Narudžba je uspješno kreirana!
            </h1>
            <p className="text-green-700 mt-1">
              Broj narudžbe: <strong>#{order.id}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Detalji narudžbe */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Detalji narudžbe</h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Broj narudžbe</p>
              <p className="font-semibold">#{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Datum</p>
              <p className="font-semibold">
                {new Date(order.createdAt).toLocaleDateString('hr-HR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold text-orange-600">
                Na čekanju uplate / Pending payment
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4">Proizvodi</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
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

          <div className="mt-6 pt-4 border-t space-y-2">
            <div className="flex justify-between">
              <span>Međuzbir:</span>
              <span>{order.subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Dostava:</span>
              <span>{order.shipping.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t font-bold text-lg">
              <span>Ukupno:</span>
              <span className="text-primary-600">{order.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Podaci za uplatu */}
        <div>
          <h2 className="text-xl font-semibold mb-4">📝 Podaci za uplatu</h2>
          <p className="text-sm text-gray-600 mb-4">
            Molimo izvršite uplatu na sljedeći račun:
          </p>
          
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 space-y-4">
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-1 font-semibold">IBAN primatelja</p>
              <p className="font-mono font-bold text-xl text-blue-900 tracking-wide">
                {bankDetails.iban}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Primatelj</p>
              <p className="font-semibold text-lg">{bankDetails.recipient}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-green-300">
              <p className="text-sm text-gray-600 mb-1 font-semibold">Iznos za uplatu</p>
              <p className="font-bold text-3xl text-green-700">
                {order.total.toFixed(2)} €
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div>
                <p className="text-sm text-gray-600">Model</p>
                <p className="font-semibold">{bankDetails.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Poziv na broj</p>
                <p className="font-semibold text-lg">{order.paymentReference}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mt-6">
              <p className="text-sm font-bold text-yellow-900 mb-3">
                ⚠️ VAŽNO - Reference/Opis uplate:
              </p>
              <div className="bg-white rounded-lg p-4 border-2 border-yellow-400">
                <p className="font-mono font-bold text-2xl text-yellow-900 text-center tracking-widest">
                  REF{order.paymentReference}
                </p>
              </div>
              <p className="text-sm text-yellow-900 mt-3">
                U polje <strong>opis/reference uplate</strong> obavezno napišite:{' '}
                <span className="font-mono font-bold">REF{order.paymentReference}</span>
              </p>
              <p className="text-xs text-yellow-800 mt-2">
                Ovo je broj vaše narudžbe i omogućit će nam da brzo identificiramo vašu uplatu.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mt-4">
              <p className="text-sm font-bold text-red-900 mb-2">
                ⏰ Rok za uplatu
              </p>
              <p className="text-sm text-red-800">
                Molimo izvršite uplatu do{' '}
                <strong className="text-base">{formattedDeadline}</strong>
                {' '}({bankDetails.paymentDeadline} dana od narudžbe).
              </p>
              <p className="text-xs text-red-700 mt-2">
                U suprotnom, narudžba će biti automatski otkazana.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Kontakt za probleme s uplatom:</p>
            <p className="text-sm">
              Email:{' '}
              <a
                href={`mailto:${bankDetails.contactEmail}`}
                className="text-primary-600 hover:text-primary-700 underline"
              >
                {bankDetails.contactEmail}
              </a>
            </p>
            <p className="text-sm">
              Telefon:{' '}
              <a
                href={`tel:${bankDetails.contactPhone}`}
                className="text-primary-600 hover:text-primary-700 underline"
              >
                {bankDetails.contactPhone}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Što se događa dalje */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          📦 Što se događa dalje?
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-900">
          <li>Izvršite uplatu koristeći podatke navedene gore</li>
          <li>
            Provjerit ćemo vašu uplatu prema bankovnom izvodu (može potrajati 1-2
            radna dana)
          </li>
          <li>
            Nakon potvrde uplate, promijeniti ćemo status narudžbe na "Uplaćeno /
            Processing"
          </li>
          <li>Pripremit ćemo i poslati vaše proizvode</li>
          <li>Obavijestit ćemo vas kada narudžba bude poslana</li>
        </ol>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <p className="text-center text-lg text-green-900 mb-2">
          ✉️ <strong>Email potvrda poslana!</strong>
        </p>
        <p className="text-center text-sm text-green-800">
          Provjerite svoju email adresu <strong>{order.customer.email}</strong> za
          potpune upute i sve detalje narudžbe.
        </p>
      </div>

      <div className="text-center">
        <a
          href="/shop"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Nastavi kupovinu
        </a>
      </div>
    </div>
  )
}

