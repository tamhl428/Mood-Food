import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.YELP_API_KEY;
const BASE_URL = 'https://api.yelp.com/v3/businesses/search';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { location, cuisine, diet } = req.query;

  if (!location || !cuisine) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!API_KEY) {
    console.error('YELP_API_KEY not configured');
    return res.status(500).json({ error: 'Yelp API key not configured. Please add YELP_API_KEY to your .env.local file.' });
  }

  const url = `${BASE_URL}?term=${encodeURIComponent(
    cuisine as string
  )}&location=${encodeURIComponent(location as string)}&limit=5`;

  try {
    const yelpRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!yelpRes.ok) {
      const errorText = await yelpRes.text();
      console.error('Yelp API error:', yelpRes.status, errorText);
      return res.status(yelpRes.status).json({ 
        error: `Yelp API error: ${yelpRes.status}`,
        details: errorText
      });
    }

    const data = await yelpRes.json();
    
    // Format the businesses data to include proper address
    const formattedBusinesses = (data.businesses || []).map((business: any) => ({
      name: business.name,
      rating: business.rating,
      review_count: business.review_count,
      url: business.url,
      address: business.location?.display_address?.join(', ') || 'Address not available',
      location: business.location
    }));
    
    return res.status(200).json({ businesses: formattedBusinesses });
  } catch (err) {
    console.error('Error calling Yelp API:', err);
    return res.status(500).json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' });
  }
} 