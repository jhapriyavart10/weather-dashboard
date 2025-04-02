import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const searchParams = request.nextUrl.searchParams;
  const days = searchParams.get('days') || '7';
  
  try {
    // Fetch historical market data from CoinGecko
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      { next: { revalidate: 3600 } } // Revalidate hourly for historical data
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: `Cryptocurrency ${id} not found` },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch history for ${id}`);
    }
    
    const data = await response.json();
    
    // Format the response
    const formattedData = {
      timestamps: data.prices.map((item: [number, number]) => 
        new Date(item[0]).toISOString()
      ),
      prices: data.prices.map((item: [number, number]) => item[1]),
      marketCaps: data.market_caps.map((item: [number, number]) => item[1]),
      totalVolumes: data.total_volumes.map((item: [number, number]) => item[1]),
    };
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error(`Crypto history API Error for ${id}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch historical data for ${id}` },
      { status: 500 }
    );
  }
}