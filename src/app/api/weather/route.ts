import { NextResponse } from 'next/server';

const OPEN_WEATHER_API_KEY = '7a051b23b1dd5c26a40ec8bf336d84f8';
const DEFAULT_CITIES = [
  { id: 'new-york', name: 'New York', country: 'US' },
  { id: 'london', name: 'London', country: 'GB' },
  { id: 'tokyo', name: 'Tokyo', country: 'JP' },
  // Add a few Indian cities to the default list (not all of them to keep the dashboard clean)
  { id: 'mumbai', name: 'Mumbai', country: 'IN' },
  { id: 'delhi', name: 'Delhi', country: 'IN' },
  { id: 'bengaluru', name: 'Bengaluru', country: 'IN' },
  { id: 'kolkata', name: 'Kolkata', country: 'IN' },
  { id: 'chennai', name: 'Chennai', country: 'IN' },
];

export async function GET() {
  try {
    // More robust implementation that doesn't fail if one city fails
    const cities = [];
    
    for (const city of DEFAULT_CITIES) {
      try {
        // URL encode the city name to handle spaces
        const encodedCityName = encodeURIComponent(city.name);
        const encodedCountry = encodeURIComponent(city.country);
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodedCityName},${encodedCountry}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
        );
        
        if (!response.ok) {
          console.error(`Error fetching ${city.name}: ${response.status} ${response.statusText}`);
          continue; // Skip this city but continue with others
        }
        
        const data = await response.json();
        
        cities.push({
          cityId: city.id,
          cityName: data.name,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
          lastUpdated: new Date().toISOString(),
        });
      } catch (cityError) {
        console.error(`Error processing ${city.name}:`, cityError);
        // Continue with other cities
      }
    }
    
    // Return whatever cities were successfully processed
    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', cities: [] },
      { status: 500 }
    );
  }
}