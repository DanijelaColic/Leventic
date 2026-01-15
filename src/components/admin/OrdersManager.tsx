import React, { useState, useEffect } from 'react'
import type { DbOrder } from '../../lib/supabase'
import { jsPDF } from 'jspdf'

type SortField = 'date' | 'total' | 'status' | 'order_number'
type SortDirection = 'asc' | 'desc'

export default function OrdersManager() {
  const [orders, setOrders] = useState<DbOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedOrder, setSelectedOrder] = useState<DbOrder | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 50

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data || [])
      } else {
        console.error('Error loading orders: HTTP', response.status)
        const errorData = await response.json().catch(() => ({}))
        alert(`Greška pri učitavanju narudžbi: ${errorData.error || 'Nepoznata greška'}`)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      alert(`Greška pri učitavanju narudžbi: ${error instanceof Error ? error.message : 'Nepoznata greška'}`)
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

  // Brisanje narudžbe
  const deleteOrder = async (orderId: string) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovu narudžbu?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadOrders()
        // Resetiraj na prvu stranicu ako je trenutna stranica prazna
        const totalPages = Math.ceil((processedOrders.length - 1) / itemsPerPage)
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages)
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Greška pri brisanju narudžbe: ${errorData.error || 'Nepoznata greška'}`)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert(`Greška pri brisanju narudžbe: ${error instanceof Error ? error.message : 'Nepoznata greška'}`)
    }
  }

  // Pretraga narudžbi
  const searchOrders = (orders: DbOrder[], query: string): DbOrder[] => {
    if (!query.trim()) return orders

    const lowerQuery = query.toLowerCase()
    return orders.filter((order) => {
      return (
        order.order_number.toLowerCase().includes(lowerQuery) ||
        order.customer_name.toLowerCase().includes(lowerQuery) ||
        order.customer_email.toLowerCase().includes(lowerQuery) ||
        order.customer_phone.toLowerCase().includes(lowerQuery) ||
        order.customer_city.toLowerCase().includes(lowerQuery)
      )
    })
  }

  // Sortiranje narudžbi
  const sortOrders = (orders: DbOrder[], field: SortField, direction: SortDirection): DbOrder[] => {
    const sorted = [...orders].sort((a, b) => {
      let comparison = 0

      switch (field) {
        case 'date':
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'total':
          comparison = a.total - b.total
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'order_number':
          comparison = a.order_number.localeCompare(b.order_number)
          break
      }

      return direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  // Kombinirano filtriranje, pretraga i sortiranje
  const processedOrders = (() => {
    let result = orders

    // Filter po statusu
    if (filter !== 'all') {
      result = result.filter((order) => order.status === filter)
    }

    // Pretraga
    result = searchOrders(result, searchQuery)

    // Sortiranje
    result = sortOrders(result, sortField, sortDirection)

    return result
  })()

  // Paginacija
  const totalPages = Math.ceil(processedOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedOrders = processedOrders.slice(startIndex, endIndex)

  // Resetiraj stranicu kada se filter ili pretraga promijene
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchQuery])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Ako je već sortirano po tom polju, promijeni smjer
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Ako je novo polje, postavi ga i default smjer
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <span className="text-gray-400 ml-1">
          <svg
            className="w-4 h-4 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </span>
      )
    }
    return (
      <span className="text-green-600 ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  // Export CSV funkcija
  const handleExportCSV = () => {
    const headers = [
      'Broj narudžbe',
      'Datum',
      'Kupac',
      'Email',
      'Telefon',
      'Adresa',
      'Grad',
      'Status',
      'Podzbroj',
      'Dostava',
      'Ukupno',
    ]

    const rows = processedOrders.map((order) => [
      order.order_number,
      new Date(order.created_at).toLocaleString('hr-HR'),
      order.customer_name,
      order.customer_email,
      order.customer_phone,
      order.customer_address,
      order.customer_city,
      order.status,
      order.subtotal.toFixed(2),
      order.shipping_cost.toFixed(2),
      order.total.toFixed(2),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `narudzbe_${new Date().toISOString().split('T')[0]}.csv`
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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

  // Izračun statistike
  const calculateStats = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const ordersToday = orders.filter(
      (order) => new Date(order.created_at) >= today
    )
    const ordersThisWeek = orders.filter(
      (order) => new Date(order.created_at) >= weekAgo
    )
    const ordersThisMonth = orders.filter(
      (order) => new Date(order.created_at) >= monthAgo
    )

    const totalValue = orders.reduce((sum, order) => sum + order.total, 0)
    const todayValue = ordersToday.reduce((sum, order) => sum + order.total, 0)
    const weekValue = ordersThisWeek.reduce((sum, order) => sum + order.total, 0)
    const monthValue = ordersThisMonth.reduce(
      (sum, order) => sum + order.total,
      0
    )

    const statusCounts = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      total: orders.length,
      today: ordersToday.length,
      thisWeek: ordersThisWeek.length,
      thisMonth: ordersThisMonth.length,
      totalValue,
      todayValue,
      weekValue,
      monthValue,
      statusCounts,
    }
  }

  const stats = calculateStats()

  if (loading) {
    return <div className="text-center py-12">Učitavanje narudžbi...</div>
  }

  return (
    <div>
      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ukupno narudžbi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Ukupna vrijednost: €{stats.totalValue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Danas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Vrijednost: €{stats.todayValue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ovaj tjedan</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.thisWeek}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Vrijednost: €{stats.weekValue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ovaj mjesec</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.thisMonth}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Vrijednost: €{stats.monthValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Status statistika - klikabilna za filtriranje */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Narudžbe po statusu
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={() => setFilter('pending')}
            className={`text-center p-4 rounded-lg transition cursor-pointer ${
              filter === 'pending'
                ? 'bg-yellow-50 border-2 border-yellow-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <p className="text-2xl font-bold text-yellow-600">
              {stats.statusCounts.pending || 0}
            </p>
            <p className="text-sm text-gray-600">Na čekanju</p>
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`text-center p-4 rounded-lg transition cursor-pointer ${
              filter === 'processing'
                ? 'bg-blue-50 border-2 border-blue-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <p className="text-2xl font-bold text-blue-600">
              {stats.statusCounts.processing || 0}
            </p>
            <p className="text-sm text-gray-600">U obradi</p>
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`text-center p-4 rounded-lg transition cursor-pointer ${
              filter === 'shipped'
                ? 'bg-purple-50 border-2 border-purple-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <p className="text-2xl font-bold text-purple-600">
              {stats.statusCounts.shipped || 0}
            </p>
            <p className="text-sm text-gray-600">Poslano</p>
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`text-center p-4 rounded-lg transition cursor-pointer ${
              filter === 'delivered'
                ? 'bg-green-50 border-2 border-green-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <p className="text-2xl font-bold text-green-600">
              {stats.statusCounts.delivered || 0}
            </p>
            <p className="text-sm text-gray-600">Dostavljeno</p>
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`text-center p-4 rounded-lg transition cursor-pointer ${
              filter === 'cancelled'
                ? 'bg-red-50 border-2 border-red-300'
                : 'hover:bg-gray-50'
            }`}
          >
            <p className="text-2xl font-bold text-red-600">
              {stats.statusCounts.cancelled || 0}
            </p>
            <p className="text-sm text-gray-600">Otkazano</p>
          </button>
        </div>
        {filter !== 'all' && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setFilter('all')}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Prikaži sve narudžbe
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upravljanje narudžbama</h2>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-1">
              Pronađeno: {processedOrders.length} narudžbi
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition flex items-center gap-2 text-sm"
            title="Export sve u CSV"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
          {/* Pretraga */}
          <div className="relative">
            <input
              type="text"
              placeholder="Pretraži narudžbe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter po statusu */}
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
      </div>

      {/* Tablica narudžbi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                onClick={() => handleSort('order_number')}
              >
                <div className="flex items-center">
                  Broj narudžbe
                  {getSortIcon('order_number')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kupac
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Datum
                  {getSortIcon('date')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center">
                  Ukupno
                  {getSortIcon('total')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOrders.map((order) => (
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
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Detalji
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Obriši narudžbu"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {processedOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchQuery
              ? 'Nema narudžbi koje odgovaraju pretrazi'
              : 'Nema narudžbi za prikaz'}
          </div>
        )}
      </div>

      {/* Paginacija */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prethodna
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sljedeća
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Prikazuje se{' '}
                <span className="font-medium">
                  {startIndex + 1} - {Math.min(endIndex, processedOrders.length)}
                </span>{' '}
                od <span className="font-medium">{processedOrders.length}</span>{' '}
                narudžbi
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Prethodna</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Prikaži samo prve 3, zadnje 3 i trenutnu stranicu s kontekstom
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === currentPage
                            ? 'z-10 bg-green-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                      >
                        ...
                      </span>
                    )
                  }
                  return null
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Sljedeća</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

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
  const handlePrintOrder = (order: DbOrder) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const printContent = generatePrintHTML(order)
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const handleExportOrder = async (order: DbOrder) => {
    try {
      // Kreiraj PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20

      // Konvertuj HTML u tekst za PDF (pojednostavljena verzija)
      const orderDate = new Date(order.created_at).toLocaleString('hr-HR')
      
      let yPos = margin
      
      // Header
      pdf.setFontSize(20)
      pdf.text(`Narudžba #${order.order_number}`, margin, yPos)
      yPos += 10
      
      pdf.setFontSize(12)
      pdf.text(`Datum: ${orderDate}`, margin, yPos)
      yPos += 7
      pdf.text(`Status: ${getStatusLabel(order.status)}`, margin, yPos)
      yPos += 15

      // Informacije o kupcu
      pdf.setFontSize(16)
      pdf.text('Informacije o kupcu', margin, yPos)
      yPos += 10
      
      pdf.setFontSize(11)
      pdf.text(`Ime: ${order.customer_name}`, margin, yPos)
      yPos += 7
      pdf.text(`Email: ${order.customer_email}`, margin, yPos)
      yPos += 7
      pdf.text(`Telefon: ${order.customer_phone}`, margin, yPos)
      yPos += 7
      pdf.text(
        `Adresa: ${order.customer_address}, ${order.customer_postal_code} ${order.customer_city}`,
        margin,
        yPos
      )
      yPos += 15

      // Stavke narudžbe
      pdf.setFontSize(16)
      pdf.text('Stavke narudžbe', margin, yPos)
      yPos += 10

      pdf.setFontSize(10)
      const items = order.items
      
      items.forEach((item) => {
        if (yPos > pageHeight - 40) {
          pdf.addPage()
          yPos = margin
        }
        
        const itemName = `${item.productName}${item.variant ? ` (${item.variant})` : ''}`
        const itemLine = `${item.quantity}x ${itemName}`
        const itemPrice = `€${(item.price * item.quantity).toFixed(2)}`
        
        pdf.text(itemLine, margin, yPos)
        pdf.text(itemPrice, pageWidth - margin - 30, yPos, { align: 'right' })
        yPos += 7
      })

      yPos += 10

      // Ukupno
      if (yPos > pageHeight - 40) {
        pdf.addPage()
        yPos = margin
      }

      pdf.setFontSize(11)
      pdf.text(`Podzbroj: €${order.subtotal.toFixed(2)}`, margin, yPos)
      yPos += 7
      pdf.text(`Dostava: €${order.shipping_cost.toFixed(2)}`, margin, yPos)
      yPos += 7
      pdf.setFontSize(14)
      pdf.setFont(undefined, 'bold')
      pdf.text(`Ukupno: €${order.total.toFixed(2)}`, margin, yPos)

      // Preuzmi PDF
      pdf.save(`narudzba_${order.order_number}.pdf`)
    } catch (error) {
      console.error('Greška pri generiranju PDF-a:', error)
      alert('Greška pri generiranju PDF-a. Pokušajte ponovno.')
    }
  }

  const generatePrintHTML = (order: DbOrder): string => {
    const orderDate = new Date(order.created_at).toLocaleString('hr-HR')
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Narudžba #${order.order_number}</title>
  <style>
    @media print {
      @page {
        margin: 1cm;
      }
      body {
        margin: 0;
        padding: 0;
      }
    }
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    .header {
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .header p {
      margin: 5px 0;
      color: #666;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      font-size: 18px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .info-item {
      margin-bottom: 10px;
    }
    .info-item strong {
      display: block;
      margin-bottom: 5px;
      color: #555;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    table th,
    table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    table th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #333;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .totals-row.total {
      font-size: 18px;
      font-weight: bold;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }
    .status {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Narudžba #${order.order_number}</h1>
    <p>Datum: ${orderDate}</p>
    <p>Status: <span class="status">${getStatusLabel(order.status)}</span></p>
  </div>

  <div class="section">
    <h2>Informacije o kupcu</h2>
    <div class="info-grid">
      <div>
        <div class="info-item">
          <strong>Ime:</strong>
          ${order.customer_name}
        </div>
        <div class="info-item">
          <strong>Email:</strong>
          ${order.customer_email}
        </div>
      </div>
      <div>
        <div class="info-item">
          <strong>Telefon:</strong>
          ${order.customer_phone}
        </div>
        <div class="info-item">
          <strong>Adresa:</strong>
          ${order.customer_address}, ${order.customer_postal_code} ${order.customer_city}
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Stavke narudžbe</h2>
    <table>
      <thead>
        <tr>
          <th>Proizvod</th>
          <th>Količina</th>
          <th class="text-right">Cijena</th>
          <th class="text-right">Ukupno</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item) => `
        <tr>
          <td>${item.productName}${item.variant ? ` (${item.variant})` : ''}</td>
          <td>${item.quantity}x</td>
          <td class="text-right">€${item.price.toFixed(2)}</td>
          <td class="text-right">€${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Podzbroj:</span>
        <span>€${order.subtotal.toFixed(2)}</span>
      </div>
      <div class="totals-row">
        <span>Dostava:</span>
        <span>€${order.shipping_cost.toFixed(2)}</span>
      </div>
      <div class="totals-row total">
        <span>UKUPNO:</span>
        <span>€${order.total.toFixed(2)}</span>
      </div>
    </div>
  </div>

  ${order.notes ? `
  <div class="section">
    <h2>Napomene</h2>
    <p>${order.notes}</p>
  </div>
  ` : ''}
</body>
</html>
    `
  }

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Na čekanju',
      processing: 'U obradi',
      shipped: 'Poslano',
      delivered: 'Dostavljeno',
      cancelled: 'Otkazano',
    }
    return labels[status] || status
  }

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

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => handlePrintOrder(order)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Ispiši
              </button>
              <button
                onClick={() => handleExportOrder(order)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export PDF
              </button>
            </div>
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

