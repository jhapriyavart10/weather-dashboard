import { NextResponse } from 'next/server';

// Default cryptocurrencies to fetch
const DEFAULT_CRYPTOS = ['bitcoin', 'ethereum', 'solana'];

export async function GET() {
  try {
    // Fetch data from CoinGecko API
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${DEFAULT_CRYPTOS.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
      { next: { revalidate: 60 } } // Revalidate every 60 seconds
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data from CoinGecko');
    }
    
    const data = await response.json();
    
    // Format the data according to our application's needs
    const formattedData = data.map((crypto: any) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol.toUpperCase(),
      price: crypto.current_price,
      priceChange24h: crypto.price_change_percentage_24h,
      marketCap: crypto.market_cap,
      lastUpdated: new Date().toISOString(),
    }));
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Crypto API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}