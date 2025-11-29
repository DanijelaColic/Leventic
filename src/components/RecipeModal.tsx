import { useEffect, useState } from 'react'
import type { Recipe } from '../data/recipes'

type RecipeModalProps = {
  recipe: Recipe | null
  onClose: () => void
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = 'hidden'
      setCurrentImageIndex(0) // Reset na prvu sliku kada se otvori modal
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [recipe])

  if (!recipe) return null

  const difficultyLabels = {
    lako: 'Lako',
    srednje: 'Srednje',
    teško: 'Teško',
  }

  // Koristi images array ako postoji, inače samo jednu sliku
  const images = recipe.images && recipe.images.length > 0 
    ? recipe.images 
    : [recipe.image]

  const currentImage = images[currentImageIndex]

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header sa slikom i galerijom */}
        <div className="relative">
          {/* Glavna slika */}
          <div className="relative h-64 md:h-96 bg-gray-50 flex items-center justify-center">
            <img
              src={currentImage}
              alt={`${recipe.title} - Slika ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/Eco_Leventic_Logo.png'
              }}
            />
            
            {/* Strelice za navigaciju (ako ima više od 1 slike) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition"
                  aria-label="Prethodna slika"
                >
                  <span className="text-2xl text-gray-700">‹</span>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-16 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition"
                  aria-label="Sljedeća slika"
                >
                  <span className="text-2xl text-gray-700">›</span>
                </button>

                {/* Indikator broja slika */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* Gumb za zatvaranje */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition z-10"
            >
              <span className="text-2xl text-gray-700">×</span>
            </button>
          </div>

          {/* Thumbnail galerija (ako ima više od 1 slike) */}
          {images.length > 1 && (
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      index === currentImageIndex
                        ? 'border-green-600 shadow-md'
                        : 'border-gray-200 hover:border-green-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${recipe.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/Eco_Leventic_Logo.png'
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sadržaj */}
        <div className="p-6 md:p-8">
          {/* Naslov i info */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {recipe.title}
            </h2>
            <p className="text-gray-600 text-lg mb-4">{recipe.description}</p>

            {/* Info badges */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-green-700">
                  ⏱️ Priprema: {recipe.prepTime}
                </span>
              </div>
              <div className="bg-orange-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-orange-700">
                  🔥 Pečenje: {recipe.cookTime}
                </span>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-blue-700">
                  👥 Porcije: {recipe.servings}
                </span>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-purple-700">
                  📊 {difficultyLabels[recipe.difficulty]}
                </span>
              </div>
            </div>
          </div>

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Sastojci
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.instructions && recipe.instructions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Postupak pripreme
              </h3>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Footer */}
          <div className="border-t pt-6 mt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🖨️ Ispiši recept
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

