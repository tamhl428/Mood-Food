import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// Restaurant type for Yelp results
interface Restaurant {
  name: string;
  address: string;
  rating: number;
  price?: string;
  url: string;
  image_url?: string;
}

interface Dish {
  name: string;
  restaurant: Restaurant;
  mockPrice: number;
}

// Helper to fetch Yelp results from our API
async function fetchYelpResults({ location, keyword }: { location: string; keyword: string }): Promise<Restaurant[]> {
  const params = new URLSearchParams({ location, cuisine: keyword }).toString();
  const res = await fetch(`/api/yelp?${params}`);
  if (!res.ok) throw new Error('Failed to fetch Yelp results');
  const data = await res.json();
  return data.businesses as Restaurant[];
}

// Helper to render stars for rating
function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  return (
    <span className="text-yellow-500">
      {'★'.repeat(fullStars)}{halfStar ? '½' : ''}{'☆'.repeat(5 - fullStars - (halfStar ? 1 : 0))}
    </span>
  );
}

// Map Yelp price tier to a mock price (random in range)
function getMockPrice(priceTier?: string): number {
  if (priceTier === '$') return Math.floor(Math.random() * 10) + 5; // $5–14
  if (priceTier === '$$') return Math.floor(Math.random() * 10) + 15; // $15–24
  if (priceTier === '$$$') return Math.floor(Math.random() * 20) + 25; // $25–44
  if (priceTier === '$$$$') return Math.floor(Math.random() * 30) + 45; // $45–74
  return Math.floor(Math.random() * 10) + 15; // Default to $15–24
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
      <div className="h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl w-full mt-auto" />
    </div>
  );
}

export default function LocationsPage() {
  const router = useRouter();
  const { dish } = router.query;
  const [location, setLocation] = useState<string>('Toronto');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [priceFilter, setPriceFilter] = useState<string>('');

  // Get location and price filter from localStorage (set by survey)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPrefs = localStorage.getItem('moodfood_prefs');
      if (storedPrefs) {
        try {
          const prefs = JSON.parse(storedPrefs);
          if (prefs.location) setLocation(prefs.location);
          if (prefs.budget) setPriceFilter(prefs.budget);
        } catch {}
      }
    }
  }, []);

  // Fetch Yelp results and generate dishes with mockPrice
  useEffect(() => {
    if (!dish || !location) return;
    setLoading(true);
    setError('');
    setDishes([]);
    fetchYelpResults({ location, keyword: String(dish) })
      .then((restaurants: Restaurant[]) => {
        // For each restaurant, create a dish with mockPrice
        const dishObjs: Dish[] = restaurants.map((r: Restaurant) => ({
          name: String(dish),
          restaurant: r,
          mockPrice: getMockPrice(r.price),
        }));
        setDishes(dishObjs);
      })
      .catch(() => setError('Failed to fetch restaurants.'))
      .finally(() => setLoading(false));
  }, [dish, location]);

  // Filter dishes by price filter
  const filteredDishes = dishes.filter((d: Dish) => {
    if (!priceFilter) return true;
    // Map price filter to range
    if (priceFilter === '<$10') return d.mockPrice < 10;
    if (priceFilter === '$10-20') return d.mockPrice >= 10 && d.mockPrice <= 20;
    if (priceFilter === '$20-30') return d.mockPrice > 20 && d.mockPrice <= 30;
    if (priceFilter === '$30+') return d.mockPrice > 30;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            🍽️ {dish || 'Delicious Food'} in {location}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in-delay">
            Discover the perfect place for your mood
          </p>
          <div className="text-center text-blue-200 text-sm mb-4">
            Estimated dish prices are based on the restaurant&apos;s price tier and are for reference only.
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-red-600 text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDishes.map((d: Dish, index: number) => (
                <div
                  key={d.restaurant.name + d.restaurant.address}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Restaurant image */}
                  <div className="relative h-48 rounded-t-2xl overflow-hidden">
                    {d.restaurant.image_url ? (
                      <Image
                        src={d.restaurant.image_url}
                        alt={d.restaurant.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 text-6xl">
                        🍽️
                      </div>
                    )}
                    {/* Price badge */}
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                      <span className="text-green-600 font-bold">${d.mockPrice}</span>
                    </div>
                  </div>

                  {/* Restaurant info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-xl text-gray-800 mb-2">{d.restaurant.name}</h3>
                      <div className="text-sm text-gray-500">🍽️</div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      {renderStars(d.restaurant.rating)}
                      <span className="ml-2 text-gray-600 text-sm">({d.restaurant.rating})</span>
                    </div>
                    
                    <div className="text-gray-600 text-sm mb-4 leading-relaxed">
                      📍 {d.restaurant.address}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-green-600 font-semibold">
                        Estimated: ${d.mockPrice}
                      </div>
                      <a
                        href={d.restaurant.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                      >
                        View on Yelp →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredDishes.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="text-gray-400 text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No restaurants found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any restaurants for &quot;{dish}&quot; in {location}.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                >
                  Try Something Else
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300"
          >
            ← Back to Mood Food
          </button>
        </div>
      </section>
    </div>
  );
} 