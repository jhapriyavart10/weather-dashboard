import { NextRequest, NextResponse } from 'next/server';

// Changed parameter structure to match Next.js expectations
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '7';
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch price history' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    const formattedData = {
      prices: data.prices.map((item: [number, number]) => ({
        timestamp: item[0],
        price: item[1]
      })),
      marketCaps: data.market_caps.map((item: [number, number]) => ({
        timestamp: item[0],
        value: item[1]
      })),
      totalVolumes: data.total_volumes.map((item: [number, number]) => ({
        timestamp: item[0],
        value: item[1]
      }))
    };
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching crypto history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    );
  }
}