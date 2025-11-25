import { CartProvider } from '../context/CartContext'
import ProductList from './ProductList'

export default function ShopContent() {
  return (
    <CartProvider>
      <div className="container mx-auto px-4 py-12">
        <ProductList />
      </div>
    </CartProvider>
  )
}

