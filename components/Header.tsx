'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import CartModal from './CartModal'

export default function Header() {
  const { getTotalItems } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const totalItems = getTotalItems()

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary-900">
              Eko Leventic
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Početna
              </Link>
              <Link
                href="/shop"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Kontakt
              </Link>
            </nav>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Košarica"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

