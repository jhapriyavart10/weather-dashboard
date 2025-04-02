import { NextRequest, NextResponse } from 'next/server';

const OPEN_WEATHER_API_KEY = '7a051b23b1dd5c26a40ec8bf336d84f8';

const CITY_MAPPINGS = {
  'new-york': { name: 'New York', country: 'US' },
  'london': { name: 'London', country: 'GB' },
  'tokyo': { name: 'Tokyo', country: 'JP' },
  // Indian cities
  'chennai': { name: 'Chennai', country: 'IN' },
  'mumbai': { name: 'Mumbai', country: 'IN' },
  'delhi': { name: 'Delhi', country: 'IN' },
  'kolkata': { name: 'Kolkata', country: 'IN' },
  'bengaluru': { name: 'Bengaluru', country: 'IN' },
  // Add more cities as needed
};

export async function GET(
  request: NextRequest,
  { params }: { params: { cityId: keyof typeof CITY_MAPPINGS } }
) {
  const { cityId } = params;
  
  try {
    // Check if city exists in our mapping
    if (!CITY_MAPPINGS[cityId]) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }
    
    const city = CITY_MAPPINGS[cityId];
    
    // Fetch current weather
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
    );
    
    if (!currentWeatherResponse.ok) {
      throw new Error(`Failed to fetch weather for ${city.name}`);
    }
    
    const currentWeatherData = await currentWeatherResponse.json();
    
    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city.name},${city.country}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      throw new Error(`Failed to fetch forecast for ${city.name}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    // Format the response
    const cityDetail = {
      cityId,
      cityName: currentWeatherData.name,
      temperature: currentWeatherData.main.temp,
      humidity: currentWeatherData.main.humidity,
      condition: currentWeatherData.weather[0].main,
      icon: currentWeatherData.weather[0].icon,
      wind: {
        speed: currentWeatherData.wind.speed,
        direction: currentWeatherData.wind.deg,
      },
      pressure: currentWeatherData.main.pressure,
      sunrise: new Date(currentWeatherData.sys.sunrise * 1000).toISOString(),
      sunset: new Date(currentWeatherData.sys.sunset * 1000).toISOString(),
      forecast: forecastData.list.map((item: any) => ({
        time: item.dt_txt,
        temperature: item.main.temp,
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
      })),
      lastUpdated: new Date().toISOString(),
    };
    
    return NextResponse.json(cityDetail);
  } catch (error) {
    console.error(`Weather API Error for ${cityId}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch weather data for ${cityId}` },
      { status: 500 }
    );
  }
}