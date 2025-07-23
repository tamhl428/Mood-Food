import type { NextApiRequest, NextApiResponse } from 'next';

// Mock restaurant data for different cuisines
const mockRestaurants = {
  'Greek': [
    { name: 'Athena Greek Restaurant', rating: 4.5, review_count: 120, url: '#', price: '$$', address: '123 Mediterranean St, Downtown' },
    { name: 'Opa! Greek Taverna', rating: 4.3, review_count: 89, url: '#', price: '$$', address: '456 Olive Ave, Midtown' },
    { name: 'Santorini Greek Kitchen', rating: 4.7, review_count: 156, url: '#', price: '$$$', address: '789 Aegean Blvd, Uptown' },
    { name: 'Mykonos Greek Grill', rating: 4.2, review_count: 67, url: '#', price: '$', address: '321 Hellenic Way, Westside' },
    { name: 'Parthenon Greek Deli', rating: 4.4, review_count: 98, url: '#', price: '$$', address: '654 Acropolis Dr, Eastside' }
  ],
  'Italian': [
    { name: 'Bella Italia Ristorante', rating: 4.6, review_count: 145, url: '#', price: '$$$', address: '123 Pasta Lane, Downtown' },
    { name: 'Mamma Mia Trattoria', rating: 4.4, review_count: 112, url: '#', price: '$$', address: '456 Pizza Ave, Midtown' },
    { name: 'Roma Italian Kitchen', rating: 4.3, review_count: 89, url: '#', price: '$$', address: '789 Olive St, Uptown' },
    { name: 'Venezia Italian Deli', rating: 4.5, review_count: 134, url: '#', price: '$', address: '321 Gondola Way, Westside' },
    { name: 'Tuscany Italian Grill', rating: 4.2, review_count: 76, url: '#', price: '$$', address: '654 Chianti Dr, Eastside' }
  ],
  'Chinese': [
    { name: 'Golden Dragon Chinese', rating: 4.4, review_count: 167, url: '#', price: '$$', address: '123 Fortune St, Downtown' },
    { name: 'Peking Palace', rating: 4.6, review_count: 189, url: '#', price: '$$$', address: '456 Bamboo Ave, Midtown' },
    { name: 'Shanghai Garden', rating: 4.3, review_count: 98, url: '#', price: '$$', address: '789 Lotus Blvd, Uptown' },
    { name: 'Wok & Roll Chinese', rating: 4.1, review_count: 67, url: '#', price: '$', address: '321 Dragon Way, Westside' },
    { name: 'Imperial Chinese Kitchen', rating: 4.5, review_count: 145, url: '#', price: '$$', address: '654 Phoenix Dr, Eastside' }
  ],
  'Indian': [
    { name: 'Taj Mahal Indian Cuisine', rating: 4.5, review_count: 134, url: '#', address: '123 Curry St, Downtown' },
    { name: 'Spice Garden Indian', rating: 4.3, review_count: 89, url: '#', address: '456 Masala Ave, Midtown' },
    { name: 'Bombay Palace', rating: 4.6, review_count: 167, url: '#', address: '789 Tandoor Blvd, Uptown' },
    { name: 'Delhi Darbar', rating: 4.2, review_count: 76, url: '#', address: '321 Naan Way, Westside' },
    { name: 'Kolkata Kitchen', rating: 4.4, review_count: 112, url: '#', address: '654 Biryani Dr, Eastside' }
  ],
  'Mexican': [
    { name: 'El Mariachi Mexican Grill', rating: 4.4, review_count: 145, url: '#', address: '123 Taco St, Downtown' },
    { name: 'Casa de Mexico', rating: 4.6, review_count: 178, url: '#', address: '456 Burrito Ave, Midtown' },
    { name: 'La Fiesta Mexicana', rating: 4.3, review_count: 98, url: '#', address: '789 Guacamole Blvd, Uptown' },
    { name: 'Taco Loco', rating: 4.1, review_count: 67, url: '#', address: '321 Salsa Way, Westside' },
    { name: 'Mexican Cantina', rating: 4.5, review_count: 134, url: '#', address: '654 Queso Dr, Eastside' }
  ],
  'Japanese': [
    { name: 'Sakura Japanese Restaurant', rating: 4.6, review_count: 167, url: '#', address: '123 Sushi St, Downtown' },
    { name: 'Tokyo Sushi Bar', rating: 4.4, review_count: 134, url: '#', address: '456 Ramen Ave, Midtown' },
    { name: 'Fuji Japanese Kitchen', rating: 4.5, review_count: 145, url: '#', address: '789 Tempura Blvd, Uptown' },
    { name: 'Hibachi Express', rating: 4.2, review_count: 89, url: '#', address: '321 Wasabi Way, Westside' },
    { name: 'Zen Japanese Cuisine', rating: 4.7, review_count: 189, url: '#', address: '654 Miso Dr, Eastside' }
  ],
  'Thai': [
    { name: 'Bangkok Thai Kitchen', rating: 4.5, review_count: 145, url: '#', address: '123 Pad Thai St, Downtown' },
    { name: 'Thai Spice Restaurant', rating: 4.3, review_count: 98, url: '#', address: '456 Curry Ave, Midtown' },
    { name: 'Siam Thai Cuisine', rating: 4.6, review_count: 167, url: '#', address: '789 Basil Blvd, Uptown' },
    { name: 'Lotus Thai Kitchen', rating: 4.2, review_count: 76, url: '#', address: '321 Coconut Way, Westside' },
    { name: 'Thai Garden Restaurant', rating: 4.4, review_count: 112, url: '#', address: '654 Lemongrass Dr, Eastside' }
  ],
  'American': [
    { name: 'Classic American Diner', rating: 4.3, review_count: 134, url: '#', address: '123 Burger St, Downtown' },
    { name: 'All-American Grill', rating: 4.5, review_count: 167, url: '#', address: '456 Steak Ave, Midtown' },
    { name: 'Patriot Pub & Grill', rating: 4.2, review_count: 89, url: '#', address: '789 BBQ Blvd, Uptown' },
    { name: 'Stars & Stripes Diner', rating: 4.1, review_count: 67, url: '#', address: '321 Hot Dog Way, Westside' },
    { name: 'Liberty American Kitchen', rating: 4.4, review_count: 112, url: '#', address: '654 Apple Pie Dr, Eastside' }
  ],
  'Mediterranean': [
    { name: 'Mediterranean Delight', rating: 4.5, review_count: 145, url: '#', address: '123 Olive St, Downtown' },
    { name: 'Aegean Mediterranean', rating: 4.3, review_count: 98, url: '#', address: '456 Hummus Ave, Midtown' },
    { name: 'Casa Mediterranea', rating: 4.6, review_count: 167, url: '#', address: '789 Falafel Blvd, Uptown' },
    { name: 'Mediterranean Breeze', rating: 4.2, review_count: 76, url: '#', address: '321 Tzatziki Way, Westside' },
    { name: 'Sunset Mediterranean', rating: 4.4, review_count: 112, url: '#', address: '654 Dolma Dr, Eastside' }
  ],
  'French': [
    { name: 'Le Petit Bistro', rating: 4.6, review_count: 167, url: '#', address: '123 Croissant St, Downtown' },
    { name: 'Cafe de Paris', rating: 4.4, review_count: 134, url: '#', address: '456 Baguette Ave, Midtown' },
    { name: 'La Maison Francaise', rating: 4.5, review_count: 145, url: '#', address: '789 Escargot Blvd, Uptown' },
    { name: 'Bistro Francais', rating: 4.2, review_count: 89, url: '#', address: '321 Fromage Way, Westside' },
    { name: 'Le Chateau Restaurant', rating: 4.7, review_count: 189, url: '#', address: '654 Vin Dr, Eastside' }
  ],
  'Korean': [
    { name: 'Seoul Korean BBQ', rating: 4.5, review_count: 145, url: '#', address: '123 Kimchi St, Downtown' },
    { name: 'Bibimbap House', rating: 4.3, review_count: 98, url: '#', address: '456 Bulgogi Ave, Midtown' },
    { name: 'Korean Garden', rating: 4.6, review_count: 167, url: '#', address: '789 Galbi Blvd, Uptown' },
    { name: 'Seoul Kitchen', rating: 4.2, review_count: 76, url: '#', address: '321 Jjigae Way, Westside' },
    { name: 'Korean Fusion', rating: 4.4, review_count: 112, url: '#', address: '654 Tteok Dr, Eastside' }
  ],
  'Vietnamese': [
    { name: 'Pho Saigon', rating: 4.4, review_count: 134, url: '#', address: '123 Pho St, Downtown' },
    { name: 'Vietnamese Delight', rating: 4.6, review_count: 167, url: '#', address: '456 Banh Mi Ave, Midtown' },
    { name: 'Saigon Kitchen', rating: 4.3, review_count: 98, url: '#', address: '789 Spring Roll Blvd, Uptown' },
    { name: 'Pho Express', rating: 4.2, review_count: 76, url: '#', address: '321 Bun Bo Way, Westside' },
    { name: 'Vietnamese Garden', rating: 4.5, review_count: 145, url: '#', address: '654 Com Tam Dr, Eastside' }
  ]
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cuisine, location } = req.query;

  if (!cuisine) {
    return res.status(400).json({ error: 'Cuisine parameter is required' });
  }

  const cuisineKey = cuisine as string;
  const restaurants = mockRestaurants[cuisineKey as keyof typeof mockRestaurants] || mockRestaurants['American'];

  // Add location to addresses and ensure all restaurants have price and image_url
  const formattedRestaurants = restaurants.map(restaurant => ({
    ...restaurant,
    price: (restaurant as { price?: string }).price || '$$',
    image_url: (restaurant as { image_url?: string }).image_url || undefined,
    address: `${restaurant.address}, ${location || 'Your City'}`
  }));

  return res.status(200).json({ businesses: formattedRestaurants });
} 