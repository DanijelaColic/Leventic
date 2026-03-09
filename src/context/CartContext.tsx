import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { products, type Product } from '../data/products'
import { parseWeight } from '../utils/shipping'
// Košarica ne koristi cookie consent provjeru jer je esencijalna funkcionalnost za kupnju

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (productId: string, quantity: number, productData?: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  getTotalWeight: () => number // Ukupna težina u kg
  shouldOpenCart: boolean
  setShouldOpenCart: (open: boolean) => void
  lastAddedItem: CartItem | null
  setLastAddedItem: (item: CartItem | null) => void
  showAddPopup: boolean
  setShowAddPopup: (show: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Funkcija za učitavanje košarice iz localStorage-a (izvan komponente da se ne poziva više puta)
function loadCartFromStorage(): CartItem[] {
  try {
    const savedCart = localStorage.getItem('eko-leventic-cart')
    if (savedCart) {
      return JSON.parse(savedCart)
    }
  } catch (e) {
    console.error('Error loading cart from localStorage', e)
  }
  return []
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  console.log('CartProvider: Initializing')
  // Učitaj košaricu iz localStorage-a prije inicijalizacije state-a
  // Ovo osigurava da se košarica ne resetira kada se CartProvider re-renderira
  const [cart, setCart] = useState<CartItem[]>(() => {
    const loaded = loadCartFromStorage()
    console.log('CartProvider: Loading cart from storage', { cartLength: loaded.length })
    return loaded
  })
  const [shouldOpenCart, setShouldOpenCart] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null)
  const [showAddPopup, setShowAddPopup] = useState(false)
  const isInitialMount = useRef(true)
  const pendingItemRef = useRef<CartItem | null>(null)
  
  console.log('CartProvider: State initialized', { cartLength: cart.length })

  // Sinkroniziraj košaricu s localStorage-om prije nego što se komponenta re-renderira
  // Ovo osigurava da se košarica ne resetira kada se CartProvider re-kreira
  useEffect(() => {
    const savedCart = loadCartFromStorage()
    if (savedCart.length > 0 && cart.length === 0) {
      console.log('CartProvider: Restoring cart from storage', { savedCartLength: savedCart.length })
      setCart(savedCart)
    }
    isInitialMount.current = false
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Košarica je esencijalna funkcionalnost za kupnju - radi uvijek, bez obzira na cookie consent
    // Ovo je potrebno jer korisnik mora moći dodati proizvode u košaricu prije nego što prihvati kolačiće
    // Spremi samo ako nije prazna košarica (izbjegni spremanje prazne košarice pri inicijalizaciji)
    if (cart.length > 0 || localStorage.getItem('eko-leventic-cart')) {
      localStorage.setItem('eko-leventic-cart', JSON.stringify(cart))
    }
  }, [cart])

  // Slušaj promjene u localStorage-u da se sinkronizira košarica između različitih CartProvider instanci
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'eko-leventic-cart' && e.newValue) {
        try {
          const newCart = JSON.parse(e.newValue)
          // Ažuriraj košaricu samo ako je drugačija
          if (JSON.stringify(newCart) !== JSON.stringify(cart)) {
            setCart(newCart)
          }
        } catch (error) {
          console.error('Error parsing cart from storage event', error)
        }
      }
    }

    // Slušaj storage events (promjene iz drugih tabova/prozora)
    window.addEventListener('storage', handleStorageChange)

    // Polling za promjene u istom prozoru (storage event se ne okida u istom prozoru)
    // Ovo je potrebno jer ShopPage ima svoj CartProvider, a CartButton koristi AppWrapper-ov CartProvider
    const interval = setInterval(() => {
      try {
        const savedCart = localStorage.getItem('eko-leventic-cart')
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          // Provjeri je li se košarica promijenila
          if (JSON.stringify(parsedCart) !== JSON.stringify(cart)) {
            setCart(parsedCart)
          }
        } else if (cart.length > 0) {
          // Ako je localStorage prazan ali košarica nije, možda je netko drugi ispraznio
          setCart([])
        }
      } catch (error) {
        // Ignore errors
      }
    }, 300) // Provjeri svakih 300ms

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [cart])

  // Detektiraj kada se doda novi proizvod
  useEffect(() => {
    console.log('CartContext: useEffect triggered', { 
      isInitialMount: isInitialMount.current, 
      pendingItem: pendingItemRef.current,
      cartLength: cart.length 
    })
    
    if (isInitialMount.current) {
      console.log('CartContext: Skipping initial mount')
      return // Preskoči pri inicijalnom učitavanju
    }
    
    if (pendingItemRef.current) {
      console.log('CartContext: Showing popup for pending item', pendingItemRef.current)
      setLastAddedItem(pendingItemRef.current)
      setShowAddPopup(true)
      pendingItemRef.current = null
    } else {
      console.log('CartContext: No pending item')
    }
  }, [cart])

  const addToCart = (productId: string, quantity: number, productData?: Product) => {
    console.log('CartContext: addToCart called', productId, quantity)
    
    // Provjeri je li productId u formatu "productId-variant" (npr. "1-1kg")
    const [baseProductId, variant] = productId.includes('-')
      ? productId.split('-')
      : [productId, null]

    // Koristi proslijeđeni product objekt (API proizvodi) ili pronađi u statičkom nizu (fallback)
    const product = productData || products.find((p) => p.id === baseProductId)
    if (!product) {
      console.log('CartContext: Product not found', baseProductId)
      return
    }

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

    // Kreiraj CartItem koji će biti dodan
    const newCartItem: CartItem = {
      product: { ...productToAdd, id: productId },
      quantity,
    }

    setCart((prevCart) => {
      console.log('CartContext: Updating cart, prevCart length:', prevCart.length)
      
      // Koristi productId za pronalaženje postojećeg itema (uključuje varijantu)
      const existingItem = prevCart.find(
        (item) => item.product.id === productId
      )
      
      if (existingItem) {
        // Ažuriraj postojeći item
        const updatedItem: CartItem = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        }
        
        console.log('CartContext: Updating existing item', updatedItem)
        console.log('CartContext: Setting pendingItemRef to', updatedItem)
        // Postavi pending item za popup
        pendingItemRef.current = updatedItem
        const newCart = prevCart.map((item) =>
          item.product.id === productId ? updatedItem : item
        )
        console.log('CartContext: New cart length after update:', newCart.length)
        return newCart
      } else {
        // Dodaj novi item
        console.log('CartContext: Adding new item', newCartItem)
        console.log('CartContext: Setting pendingItemRef to', newCartItem)
        // Postavi pending item za popup
        pendingItemRef.current = newCartItem
        const newCart = [...prevCart, newCartItem]
        console.log('CartContext: New cart length after add:', newCart.length)
        return newCart
      }
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

  const getTotalWeight = () => {
    return cart.reduce((total, item) => {
      // Izvuci težinu iz productId (npr. "1-1kg" -> "1kg" -> 1)
      const productId = item.product.id
      const variant = productId.includes('-') ? productId.split('-')[1] : null
      
      if (variant) {
        // Ako postoji varijanta, koristi njezinu težinu
        const weight = parseWeight(variant)
        return total + weight * item.quantity
      }
      
      // Ako nema varijante, provjeri ima li proizvod varijante (koristi najmanju)
      if (item.product.variants && item.product.variants.length > 0) {
        const minWeight = Math.min(
          ...item.product.variants.map((v) => parseWeight(v.weight))
        )
        return total + minWeight * item.quantity
      }
      
      // Ako nema varijanti, pokušaj izvući težinu iz naziva proizvoda
      const nameWeight = parseWeight(item.product.name)
      if (nameWeight > 0) {
        return total + nameWeight * item.quantity
      }
      
      // Ako ništa ne radi, pretpostavi 1kg po jedinici
      return total + 1 * item.quantity
    }, 0)
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
        getTotalWeight,
        shouldOpenCart,
        setShouldOpenCart,
        lastAddedItem,
        setLastAddedItem,
        showAddPopup,
        setShowAddPopup,
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

