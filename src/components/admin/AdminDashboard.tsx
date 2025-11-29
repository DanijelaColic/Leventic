import React, { useState, useEffect } from 'react'
import AdminAuth from './AdminAuth'
import AdminLayout from './AdminLayout'
import ProductsManager from './ProductsManager'
import OrdersManager from './OrdersManager'
import SettingsManager from './SettingsManager'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState<
    'products' | 'orders' | 'settings'
  >('products')

  // Provjera autentifikacije prilikom učitavanja
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Praćenje promjene hash-a u URL-u za navigaciju
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'products' || hash === 'orders' || hash === 'settings') {
        setCurrentPage(hash)
      }
    }

    handleHashChange() // Pozovi odmah da postavi početnu stranicu
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
  }

  // Ako nije autentificiran, prikaži login formu
  if (!isAuthenticated) {
    return <AdminAuth onLogin={handleLogin} />
  }

  // Renderiranje trenutne stranice
  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <ProductsManager />
      case 'orders':
        return <OrdersManager />
      case 'settings':
        return <SettingsManager />
      default:
        return <ProductsManager />
    }
  }

  return (
    <AdminLayout currentPage={currentPage} onLogout={handleLogout}>
      {renderPage()}
    </AdminLayout>
  )
}

