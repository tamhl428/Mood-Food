import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// Recipe type for our suggestions
interface Recipe {
  name: string;
  description: string;
  mood: string;
  cuisine: string;
  difficulty: string;
  time: string;
  sessionId?: string;
  timestamp?: number;
}

// Helper to render stars for difficulty
function renderDifficulty(difficulty: string) {
  const levels = {
    'Easy': 1,
    'Medium': 2,
    'Hard': 3
  };
  const stars = levels[difficulty as keyof typeof levels] || 1;
  return (
    <span className="text-yellow-500">
      {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
    </span>
  );
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full animate-pulse">
      <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 w-full rounded-xl mb-4" />
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl w-full mt-auto" />
    </div>
  );
}

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [moodFilter, setMoodFilter] = useState<string>('');
  const [cuisineFilter, setCuisineFilter] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');

  // Get session ID from localStorage and fetch recipes immediately
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get the most recent session ID from localStorage
      const recentSessionId = localStorage.getItem('moodzera_recent_session');
      if (recentSessionId) {
        setSessionId(recentSessionId);
      }
      
      // Don't set filters from survey - let the API handle filtering based on conversation
      // The recipes should come from the current conversation session
    }
  }, []);

  // Fetch recipes from API
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (moodFilter) params.append('mood', moodFilter);
      if (cuisineFilter) params.append('cuisine', cuisineFilter);
      if (sessionId) params.append('sessionId', sessionId);
      
      const response = await fetch(`/api/get-recipes?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      // Fallback to empty array
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Load recipes when filters change
  useEffect(() => {
    fetchRecipes();
  }, [moodFilter, cuisineFilter, sessionId]);

  const clearFilters = () => {
    setMoodFilter('');
    setCuisineFilter('');
  };

  const refreshRecipes = () => {
    fetchRecipes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center space-x-3">
                <Image
                  src="/logo.svg"
                  alt="MOODZERA Logo"
                  width={240}
                  height={96}
                />
                <h1 className="text-2xl font-bold text-gray-800">Recipe Suggestions</h1>
              </div>
            </div>
            <button
              onClick={refreshRecipes}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filters:</span>
              {moodFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Mood: {moodFilter}
                  <button
                    onClick={() => setMoodFilter('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {cuisineFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Cuisine: {cuisineFilter}
                  <button
                    onClick={() => setCuisineFilter('')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            {(moodFilter || cuisineFilter) && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-6">
              <div className="text-4xl mb-4">🍽️</div>
              <div className="text-lg font-medium mb-2">No recipes found yet</div>
              <div className="text-sm">
                {sessionId ? 
                  "Start chatting with the AI to get personalized recipe suggestions!" :
                  "No recipes found for your current filters."
                }
              </div>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold"
              >
                Start Chat
              </button>
              {moodFilter || cuisineFilter ? (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold"
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Recipe Image Placeholder with Category Badge */}
                <div className="relative bg-gradient-to-br from-blue-100 to-indigo-200 h-48 w-full flex items-center justify-center">
                  <span className="text-6xl">🍽️</span>
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
                      {recipe.cuisine.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Recipe Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Recipe Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{recipe.name}</h3>
                  
                  {/* Recipe Description */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">{recipe.description}</p>
                  
                  {/* Recipe Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">DIFFICULTY</div>
                      <div className="flex items-center justify-center">
                        {renderDifficulty(recipe.difficulty)}
                        <span className="ml-1 text-xs text-gray-700">{recipe.difficulty}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">TIME</div>
                      <div className="text-sm font-medium text-gray-700">{recipe.time}</div>
                    </div>
                  </div>
                  
                  {/* Recipe Button */}
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <span>📋</span>
                    <span>View Recipe Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 