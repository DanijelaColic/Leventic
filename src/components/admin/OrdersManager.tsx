import React, { useState, useEffect } from 'react'
import type { DbOrder } from '../../lib/supabase'

export default function OrdersManager() {
  const [orders, setOrders] = useState<DbOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<DbOrder | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await loadOrders()
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }

    const labels = {
      pending: 'Na čekanju',
      processing: 'U obradi',
      shipped: 'Poslano',
      delivered: 'Dostavljeno',
      cancelled: 'Otkazano',
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (loading) {
    return <div className="text-center py-12">Učitavanje narudžbi...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Upravljanje narudžbama</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Sve narudžbe</option>
            <option value="pending">Na čekanju</option>
            <option value="processing">U obradi</option>
            <option value="shipped">Poslano</option>
            <option value="delivered">Dostavljeno</option>
            <option value="cancelled">Otkazano</option>
          </select>
        </div>
      </div>

      {/* Tablica narudžbi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Broj narudžbe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kupac
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ukupno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.order_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customer_name}
                  </div>
                  <div className="text-sm text-gray-500">{order.customer_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('hr-HR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Detalji
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nema narudžbi za prikaz
          </div>
        )}
      </div>

      {/* Modal za detalje narudžbe */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onUpdateStatus={updateOrderStatus}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

// Modal komponenta za detalje narudžbe
function OrderDetailsModal({
  order,
  onUpdateStatus,
  onClose,
}: {
  order: DbOrder
  onUpdateStatus: (orderId: string, status: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold">Narudžba #{order.order_number}</h3>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString('hr-HR')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Informacije o kupcu */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Informacije o kupcu</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
              <p>
                <span className="font-medium">Ime:</span> {order.customer_name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.customer_email}
              </p>
              <p>
                <span className="font-medium">Telefon:</span> {order.customer_phone}
              </p>
              <p>
                <span className="font-medium">Adresa:</span> {order.customer_address},{' '}
                {order.customer_postal_code} {order.customer_city}
              </p>
            </div>
          </div>

          {/* Stavke narudžbe */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Stavke narudžbe</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Proizvod
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Količina
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      Cijena
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">
                        {item.productName}
                        {item.variant && ` (${item.variant})`}
                      </td>
                      <td className="px-4 py-2 text-sm">{item.quantity}x</td>
                      <td className="px-4 py-2 text-sm text-right">
                        €{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Podzbroj:</span>
                <span>€{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Dostava:</span>
                <span>€{order.shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Ukupno:</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status i napomene */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Status narudžbe</h4>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="pending">Na čekanju</option>
              <option value="processing">U obradi</option>
              <option value="shipped">Poslano</option>
              <option value="delivered">Dostavljeno</option>
              <option value="cancelled">Otkazano</option>
            </select>
          </div>

          {order.notes && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Napomene</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {order.notes}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Zatvori
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

