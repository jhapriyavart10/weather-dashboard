import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch cryptocurrency details' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    const cryptoDetails = {
      id: data.id,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      image: data.image?.large,
      description: data.description?.en,
      price: data.market_data?.current_price?.usd,
      priceChange24h: data.market_data?.price_change_percentage_24h,
      marketCap: data.market_data?.market_cap?.usd,
      totalVolume: data.market_data?.total_volume?.usd,
      high24h: data.market_data?.high_24h?.usd,
      low24h: data.market_data?.low_24h?.usd,
      lastUpdated: data.last_updated
    };
    
    return NextResponse.json(cryptoDetails);
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency details' },
      { status: 500 }
    );
  }
}