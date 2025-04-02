import { NextResponse } from 'next/server';

// In a real app, store this in an environment variable
const NEWS_API_KEY = process.env.NEWS_API_KEY ;

export async function GET() {
  try {
    // Fetch crypto news from NewsData.io
    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=cryptocurrency OR bitcoin OR ethereum&language=en&size=5`,
      { next: { revalidate: 3600 } } // Revalidate hourly
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news data');
    }
    
    const data = await response.json();
    
    // Format the response
    const articles = data.results.map((article: any) => ({
      id: article.article_id || Math.random().toString(36).substr(2, 9),
      title: article.title,
      description: article.description,
      url: article.link,
      imageUrl: article.image_url,
      source: article.source_id,
      publishedAt: article.pubDate,
    }));
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('News API Error:', error);
    
    // If the API fails, return mock data (optional, for development)
    const mockArticles = [
      {
        id: '1',
        title: 'Bitcoin Surges Past $60,000',
        description: 'The world\'s largest cryptocurrency by market cap has reached new heights...',
        url: 'https://example.com/news/1',
        imageUrl: 'https://example.com/images/btc.jpg',
        source: 'CryptoNews',
        publishedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Update Coming Soon',
        description: 'Developers confirm the next major update to the Ethereum network...',
        url: 'https://example.com/news/2',
        imageUrl: 'https://example.com/images/eth.jpg',
        source: 'BlockchainReport',
        publishedAt: new Date().toISOString(),
      },
      // Add more mock articles as needed
    ];
    
    return NextResponse.json(
      mockArticles,
      { status: 200 }
    );
  }
}