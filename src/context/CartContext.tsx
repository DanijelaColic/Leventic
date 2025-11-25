import React, { createContext, useContext, useState, useEffect } from 'react'
import { products, type Product } from '../data/products'

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('eko-leventic-cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        setCart(parsed)
      } catch (e) {
        console.error('Error loading cart from localStorage', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eko-leventic-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (productId: string, quantity: number) => {
    // Provjeri je li productId u formatu "productId-variant" (npr. "1-1kg")
    const [baseProductId, variant] = productId.includes('-')
      ? productId.split('-')
      : [productId, null]

    const product = products.find((p) => p.id === baseProductId)
    if (!product) return

    // Ako postoji varijanta, kreiraj proizvod s informacijama o varijanti
    let productToAdd = product
    if (variant && product.variants) {
      const variantData = product.variants.find((v) => v.weight === variant)
      if (variantData) {
        // Kreiraj kopiju proizvoda s cijenom varijante
        productToAdd = {
          ...product,
          name: `${product.name} ${variant}`,
          price: variantData.price,
        }
      }
    }

    setCart((prevCart) => {
      // Koristi productId za pronalaženje postojećeg itema (uključuje varijantu)
      const existingItem = prevCart.find(
        (item) => item.product.id === productId
      )
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      // Kreiraj novi item s productId koji uključuje varijantu
      return [
        ...prevCart,
        { product: { ...productToAdd, id: productId }, quantity },
      ]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    )
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

