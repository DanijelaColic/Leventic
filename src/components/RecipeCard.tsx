import type { Recipe } from '../data/recipes'

type RecipeCardProps = {
  recipe: Recipe
  onViewRecipe: (recipe: Recipe) => void
}

export default function RecipeCard({ recipe, onViewRecipe }: RecipeCardProps) {
  const difficultyColors = {
    lako: 'bg-green-100 text-green-800',
    srednje: 'bg-yellow-100 text-yellow-800',
    teško: 'bg-red-100 text-red-800',
  }

  const categoryLabels = {
    kruh: '🍞 Kruh',
    slasno: '🥗 Slasno',
    slatko: '🍰 Slatko',
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Slika - klikabilna */}
      <div 
        className="relative h-48 overflow-hidden bg-gray-200 cursor-pointer"
        onClick={() => onViewRecipe(recipe)}
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/Eco_Leventic_Logo.png'
          }}
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              difficultyColors[recipe.difficulty]
            }`}
          >
            {recipe.difficulty.charAt(0).toUpperCase() +
              recipe.difficulty.slice(1)}
          </span>
        </div>
        {/* Overlay sa ikonom za otvaranje */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <span className="text-white text-4xl opacity-0 hover:opacity-100 transition-opacity">
            🔍
          </span>
        </div>
      </div>

      {/* Sadržaj */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Kategorija */}
        <div className="mb-2">
          <span className="text-sm text-gray-600">
            {categoryLabels[recipe.category]}
          </span>
        </div>

        {/* Naslov - također klikabilan */}
        <h3 
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-green-600 transition-colors"
          onClick={() => onViewRecipe(recipe)}
        >
          {recipe.title}
        </h3>

        {/* Opis */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>

        {/* Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔥</span>
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{recipe.servings}</span>
          </div>
        </div>

        {/* Spacer koji gura gumb na dno */}
        <div className="flex-grow"></div>

        {/* Gumb */}
        <button
          onClick={() => onViewRecipe(recipe)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-auto"
        >
          Pogledaj recept
        </button>
      </div>
    </div>
  )
}

