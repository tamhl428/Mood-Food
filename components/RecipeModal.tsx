import React from 'react';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeName: string;
  mood: string;
  cuisine: string;
}

export default function RecipeModal({ isOpen, onClose, recipeName, mood, cuisine }: RecipeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{recipeName}</h2>
            <p className="text-gray-600 mt-1">Perfect for when you&apos;re feeling {mood.toLowerCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Recipe Content */}
        <div className="p-6">
          {/* Recipe Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="text-blue-600 font-semibold mb-1">Cuisine</div>
              <div className="text-gray-800">{cuisine}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <div className="text-green-600 font-semibold mb-1">Mood</div>
              <div className="text-gray-800">{mood}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="text-purple-600 font-semibold mb-1">Prep Time</div>
              <div className="text-gray-800">30-45 minutes</div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🥘</span>
              Ingredients
            </h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">2 tablespoons olive oil</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">1 onion, finely chopped</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">3 cloves garlic, minced</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">1 pound chicken breast, cubed</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">2 cups chicken broth</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">1 cup heavy cream</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Salt and pepper to taste</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">👨‍🍳</span>
              Instructions
            </h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                  1
                </div>
                <div className="text-gray-700">
                  <strong>Heat the oil</strong> in a large skillet over medium heat. Add the chopped onion and cook until softened, about 5 minutes.
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                  2
                </div>
                <div className="text-gray-700">
                  <strong>Add garlic</strong> and cook for 1 minute until fragrant. Be careful not to burn it.
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                  3
                </div>
                <div className="text-gray-700">
                  <strong>Add chicken</strong> and cook until browned on all sides, about 5-7 minutes.
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                  4
                </div>
                <div className="text-gray-700">
                  <strong>Pour in broth</strong> and bring to a simmer. Cook for 10 minutes until chicken is cooked through.
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                  5
                </div>
                <div className="text-gray-700">
                  <strong>Add cream</strong> and simmer for 5 more minutes until sauce thickens. Season with salt and pepper.
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                  6
                </div>
                <div className="text-gray-700">
                  <strong>Serve hot</strong> over rice or pasta. Garnish with fresh herbs if desired.
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              Pro Tips
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li>• For extra flavor, marinate the chicken in yogurt and spices for 30 minutes before cooking</li>
              <li>• Add vegetables like bell peppers or mushrooms for extra nutrition</li>
              <li>• Serve with naan bread or rice for a complete meal</li>
              <li>• Leftovers taste even better the next day!</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            Got it! 👍
          </button>
        </div>
      </div>
    </div>
  );
} 