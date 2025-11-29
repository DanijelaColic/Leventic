import { useState } from 'react'
import { recipes } from '../data/recipes'
import type { Recipe } from '../data/recipes'
import RecipeCard from './RecipeCard'
import RecipeModal from './RecipeModal'
import Header from './Header'
import { CartProvider } from '../context/CartContext'

export default function RecipesPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [filter, setFilter] = useState<'all' | 'kruh' | 'slasno' | 'slatko'>(
    'all'
  )

  const filteredRecipes =
    filter === 'all' ? recipes : recipes.filter((r) => r.category === filter)

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />

      {/* Hero sekcija */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🌾 Recepti sa Pirovim Brašnom
          </h1>
          <p className="text-xl text-green-100 max-w-3xl">
            Otkrijte ukusne i hranjive recepte od organskog pirovog brašna.
            Tradicionalni recepti sa modernim pristupom zdravoj prehrani.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sve ({recipes.length})
            </button>
            <button
              onClick={() => setFilter('kruh')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'kruh'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🍞 Kruh ({recipes.filter((r) => r.category === 'kruh').length})
            </button>
            <button
              onClick={() => setFilter('slasno')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'slasno'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🥗 Slasno ({recipes.filter((r) => r.category === 'slasno').length})
            </button>
            <button
              onClick={() => setFilter('slatko')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'slatko'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🍰 Slatko ({recipes.filter((r) => r.category === 'slatko').length})
            </button>
          </div>
        </div>
      </div>

      {/* Recepti grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onViewRecipe={setSelectedRecipe}
            />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nema recepata u ovoj kategoriji.
            </p>
          </div>
        )}
      </div>

      {/* Info sekcija */}
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🌾</div>
              <h3 className="font-semibold text-lg mb-2">100% Organsko</h3>
              <p className="text-gray-600 text-sm">
                Svi recepti koriste organsko pirovo brašno iz Slavonije
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💚</div>
              <h3 className="font-semibold text-lg mb-2">Zdravo i Ukusno</h3>
              <p className="text-gray-600 text-sm">
                Hranjivi recepti za cijelu obitelj, laki za probavu
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍🍳</div>
              <h3 className="font-semibold text-lg mb-2">Lako Pripremiti</h3>
              <p className="text-gray-600 text-sm">
                Jednostavni postupci sa detaljnim uputama
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
      </div>
    </CartProvider>
  )
}

