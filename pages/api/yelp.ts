import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.YELP_API_KEY;
const BASE_URL = 'https://api.yelp.com/v3/businesses/search';

interface YelpBusiness {
  name: string;
  rating: number;
  review_count: number;
  url: string;
  price?: string;
  image_url?: string;
  location: {
    display_address?: string[];
    [key: string]: unknown;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { location, cuisine } = req.query;

  if (!location || !cuisine) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!API_KEY) {
    console.error('YELP_API_KEY not configured');
    return res.status(500).json({ error: 'Yelp API key not configured. Please add YELP_API_KEY to your .env.local file.' });
  }

  // Try different search strategies for better results
  const searchTerms = [
    cuisine as string,
    `${cuisine} restaurant`,
    `${cuisine} food`,
    cuisine as string
  ];
  
  let allBusinesses: any[] = [];
  
  try {
    for (const term of searchTerms) {
      const url = `${BASE_URL}?term=${encodeURIComponent(term)}&location=${encodeURIComponent(location as string)}&limit=10&radius=40000`;

      const yelpRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (!yelpRes.ok) {
        const errorText = await yelpRes.text();
        console.error('Yelp API error:', yelpRes.status, errorText);
        // Continue with next search term instead of failing completely
        continue;
      }

      const data = await yelpRes.json();
      
      if (data.businesses && data.businesses.length > 0) {
        allBusinesses = [...allBusinesses, ...data.businesses];
      }
    }
  
  // Remove duplicates based on business name and address
  const uniqueBusinesses = allBusinesses.filter((business, index, self) => 
    index === self.findIndex(b => b.name === business.name && b.location?.display_address?.join(', ') === business.location?.display_address?.join(', '))
  );
  
  // Check if we got any businesses
  if (uniqueBusinesses.length === 0) {
    console.log(`No businesses found for ${cuisine} in ${location}`);
    return res.status(200).json({ businesses: [] });
  }
  
  // Format the businesses data to include proper address
  const formattedBusinesses = uniqueBusinesses.slice(0, 10).map((business: unknown) => {
    const b = business as YelpBusiness;
    return {
      name: b.name,
      rating: b.rating,
      review_count: b.review_count,
      url: b.url,
      price: b.price,
      image_url: b.image_url,
      address: b.location?.display_address?.join(', ') || 'Address not available',
      location: b.location
    };
  });
  return res.status(200).json({ businesses: formattedBusinesses });
  } catch (err: unknown) {
    console.error('Error calling Yelp API:', err);
    return res.status(500).json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' });
  }
} 