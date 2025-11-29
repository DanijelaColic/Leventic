import ProductList from './ProductList'

export default function ShopContent() {
  console.log('ShopContent: Rendering')
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary-900 mb-8 text-center">
        Naši proizvodi
      </h1>
      <ProductList />
    </div>
  )
}

