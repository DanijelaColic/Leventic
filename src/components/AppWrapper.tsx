import { CartProvider } from '../context/CartContext'
import Header from './Header'

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      {children}
    </CartProvider>
  )
}

