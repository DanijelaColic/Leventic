import CartButton from './CartButton'

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 text-2xl font-bold text-primary-900">
            <img
              src="/Eco_Leventic_Logo.png"
              alt="Eko Leventić Logo"
              className="h-10 w-auto"
            />
            Eko Leventić
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Početna
            </a>
            <a
              href="/shop"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Shop
            </a>
            <a
              href="/recepti"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Recepti
            </a>
            <a
              href="/contact"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Kontakt
            </a>
          </nav>
          <CartButton />
        </div>
      </div>
    </header>
  )
}

