import type { NextApiRequest, NextApiResponse } from 'next';

// Mock restaurant data for different cuisines
const mockRestaurants = {
  sushi: [
    { name: "Sakura Sushi", rating: 4.5, review_count: 128, address: "123 Queen St, Toronto", url: "#" },
    { name: "Tokyo Express", rating: 4.2, review_count: 89, address: "456 Bloor St, Toronto", url: "#" },
    { name: "Fresh Fish Co.", rating: 4.7, review_count: 156, address: "789 Yonge St, Toronto", url: "#" },
  ],
  pizza: [
    { name: "Pizza Palace", rating: 4.3, review_count: 234, address: "321 King St, Toronto", url: "#" },
    { name: "Slice of Heaven", rating: 4.6, review_count: 167, address: "654 College St, Toronto", url: "#" },
    { name: "Italian Pizza House", rating: 4.1, review_count: 98, address: "987 Dundas St, Toronto", url: "#" },
  ],
  comfort: [
    { name: "Cozy Kitchen", rating: 4.4, review_count: 145, address: "111 Spadina Ave, Toronto", url: "#" },
    { name: "Home Style Diner", rating: 4.2, review_count: 112, address: "222 Bathurst St, Toronto", url: "#" },
    { name: "Comfort Zone", rating: 4.5, review_count: 178, address: "333 Ossington Ave, Toronto", url: "#" },
  ],
  italian: [
    { name: "Bella Italia", rating: 4.6, review_count: 189, address: "444 Queen St W, Toronto", url: "#" },
    { name: "Pasta Palace", rating: 4.3, review_count: 134, address: "555 King St W, Toronto", url: "#" },
    { name: "Romano's", rating: 4.4, review_count: 156, address: "666 College St W, Toronto", url: "#" },
  ],
  chinese: [
    { name: "Golden Dragon", rating: 4.2, review_count: 167, address: "777 Spadina Ave, Toronto", url: "#" },
    { name: "Lucky Wok", rating: 4.0, review_count: 98, address: "888 Dundas St W, Toronto", url: "#" },
    { name: "Peking House", rating: 4.3, review_count: 123, address: "999 Queen St E, Toronto", url: "#" },
  ],
  indian: [
    { name: "Taj Mahal", rating: 4.5, review_count: 145, address: "101 Gerrard St, Toronto", url: "#" },
    { name: "Spice Route", rating: 4.1, review_count: 87, address: "202 Danforth Ave, Toronto", url: "#" },
    { name: "Curry House", rating: 4.3, review_count: 112, address: "303 Bloor St E, Toronto", url: "#" },
  ],
  mexican: [
    { name: "El Mariachi", rating: 4.4, review_count: 134, address: "404 Queen St W, Toronto", url: "#" },
    { name: "Taco Time", rating: 4.0, review_count: 76, address: "505 King St W, Toronto", url: "#" },
    { name: "Mexican Grill", rating: 4.2, review_count: 98, address: "606 College St W, Toronto", url: "#" },
  ],
  american: [
    { name: "Burger Joint", rating: 4.3, review_count: 156, address: "707 Queen St W, Toronto", url: "#" },
    { name: "American Diner", rating: 4.1, review_count: 89, address: "808 King St W, Toronto", url: "#" },
    { name: "BBQ House", rating: 4.5, review_count: 167, address: "909 College St W, Toronto", url: "#" },
  ],
  dessert: [
    { name: "Sweet Dreams", rating: 4.6, review_count: 123, address: "111 Queen St W, Toronto", url: "#" },
    { name: "Ice Cream Paradise", rating: 4.3, review_count: 98, address: "222 King St W, Toronto", url: "#" },
    { name: "Cake Corner", rating: 4.4, review_count: 145, address: "333 College St W, Toronto", url: "#" },
  ],
  coffee: [
    { name: "Brew & Bean", rating: 4.5, review_count: 178, address: "444 Queen St W, Toronto", url: "#" },
    { name: "Coffee Corner", rating: 4.2, review_count: 134, address: "555 King St W, Toronto", url: "#" },
    { name: "Cafe Central", rating: 4.3, review_count: 156, address: "666 College St W, Toronto", url: "#" },
  ],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cuisine } = req.query;
  const cuisineKey = (cuisine as string)?.toLowerCase();

  if (!cuisineKey) {
    return res.status(400).json({ error: 'Cuisine parameter is required' });
  }

  // Get restaurants for the cuisine, or default to comfort food
  const restaurants = mockRestaurants[cuisineKey as keyof typeof mockRestaurants] || mockRestaurants.comfort;

  // Simulate a small delay to mimic real API
  await new Promise(resolve => setTimeout(resolve, 300));

  return res.status(200).json({ 
    businesses: restaurants,
    note: "Using mock data - Yelp API not available"
  });
} 