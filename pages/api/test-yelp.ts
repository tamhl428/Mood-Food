import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const API_KEY = process.env.YELP_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ 
      error: 'YELP_API_KEY not found in environment variables',
      solution: 'Add YELP_API_KEY to your .env.local file'
    });
  }

  try {
    // Test with a simple search
    const testUrl = 'https://api.yelp.com/v3/businesses/search?term=restaurant&location=Toronto&limit=1';
    
    const response = await fetch(testUrl, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Yelp API test failed:', response.status, errorText);
      
      let errorMessage = `Yelp API returned status ${response.status}`;
      let solution = '';
      
      if (response.status === 401) {
        errorMessage = 'Invalid API key';
        solution = 'Check that your Yelp API key is correct';
      } else if (response.status === 403) {
        errorMessage = 'API key not authorized';
        solution = 'Your API key may not have the required permissions or subscription level';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded';
        solution = 'You may have exceeded your Yelp API quota. Check your subscription level.';
      } else if (response.status === 400) {
        errorMessage = 'Bad request';
        solution = 'Check the API parameters';
      }
      
      return res.status(response.status).json({ 
        error: errorMessage,
        details: errorText,
        solution,
        status: response.status
      });
    }

    const data = await response.json();
    return res.status(200).json({ 
      success: true,
      message: 'Yelp API is working correctly!',
      sampleData: data.businesses?.[0] || 'No businesses returned'
    });
    
  } catch (err) {
    console.error('Error testing Yelp API:', err);
    return res.status(500).json({ 
      error: 'Failed to connect to Yelp API',
      details: err instanceof Error ? err.message : 'Unknown error',
      solution: 'Check your internet connection and API key'
    });
  }
} 