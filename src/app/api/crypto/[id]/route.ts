import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    // Fetch detailed data from CoinGecko API
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      { next: { revalidate: 60 } } // Revalidate every 60 seconds
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: `Cryptocurrency ${id} not found` },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch details for ${id}`);
    }
    
    const data = await response.json();
    
    // Format the response
    const cryptoDetail = {
      id: data.id,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      description: data.description.en,
      image: data.image.large,
      price: data.market_data.current_price.usd,
      priceChange24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      totalVolume: data.market_data.total_volume.usd,
      circulatingSupply: data.market_data.circulating_supply,
      totalSupply: data.market_data.total_supply,
      maxSupply: data.market_data.max_supply,
      ath: data.market_data.ath.usd,
      athChangePercentage: data.market_data.ath_change_percentage.usd,
      athDate: data.market_data.ath_date.usd,
      lastUpdated: new Date().toISOString(),
    };
    
    return NextResponse.json(cryptoDetail);
  } catch (error) {
    console.error(`Crypto API Error for ${id}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch data for ${id}` },
      { status: 500 }
    );
  }
}