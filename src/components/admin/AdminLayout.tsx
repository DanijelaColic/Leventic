import React, { type ReactNode } from 'react'

type AdminLayoutProps = {
  children: ReactNode
  currentPage: 'products' | 'orders' | 'settings'
  onLogout: () => void
}

export default function AdminLayout({
  children,
  currentPage,
  onLogout,
}: AdminLayoutProps) {
  const navItems = [
    { id: 'products', label: 'Proizvodi', icon: '📦' },
    { id: 'orders', label: 'Narudžbe', icon: '🛒' },
    { id: 'settings', label: 'Postavke', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-green-800">
                🌾 Eko Leventić Admin
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Odjavi se
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r border-gray-200">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`/admin#${item.id}`}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  currentPage === item.id
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

