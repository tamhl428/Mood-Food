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
    <div className="animate-pulse bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="bg-gray-200 h-36 w-full rounded mb-4" />
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
      <div className="h-8 bg-gray-200 rounded w-1/2 mt-auto" />
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8">
        Restaurants for <span className="text-blue-700">{dish || '...'}</span> in <span className="text-blue-700">{location}</span>
      </h1>
      <div className="text-center text-gray-500 text-sm mb-4">
        Estimated dish prices are based on the restaurant's price tier and are for reference only.
      </div>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}
      {error && <div className="text-center text-red-600">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {!loading && !error && filteredDishes.map((d: Dish) => (
          <div
            key={d.restaurant.name + d.restaurant.address}
            className="bg-white rounded-lg shadow p-4 flex flex-col h-full"
          >
            {/* Restaurant image */}
            {d.restaurant.image_url ? (
              <Image
                src={d.restaurant.image_url}
                alt={d.restaurant.name}
                width={400}
                height={144}
                className="w-full h-36 object-cover rounded mb-4"
                style={{ objectFit: 'cover' }}
                // If you don't know the image size, you can use layout="responsive" in older Next.js or fill in Next 13+
              />
            ) : (
              <div className="w-full h-36 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-400 text-3xl">
                <span>🍽️</span>
              </div>
            )}
            <div className="font-semibold text-lg mb-1">{d.restaurant.name}</div>
            <div className="mb-1">{renderStars(d.restaurant.rating)} <span className="ml-2 text-gray-600">({d.restaurant.rating})</span></div>
            <div className="text-gray-600 mb-1 text-sm">{d.restaurant.address}</div>
            <div className="text-gray-700 mb-2">Estimated price: ${d.mockPrice}</div>
            <a
              href={d.restaurant.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
            >
              View on Yelp
            </a>
          </div>
        ))}
      </div>
      {!loading && !error && filteredDishes.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          No restaurants found for "{dish}" in {location}.
        </div>
      )}
    </div>
  );
} 