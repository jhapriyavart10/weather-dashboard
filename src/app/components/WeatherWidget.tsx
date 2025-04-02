'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchWeatherData } from '@/redux/slices/weatherSlice';

export default function WeatherWidget() {
  const dispatch = useAppDispatch();
  const { cities, loading, error } = useAppSelector(state => state.weather);
  const { temperatureUnit } = useAppSelector(state => state.preferences);
  
  useEffect(() => {
    dispatch(fetchWeatherData());
    
    // Refresh weather data every 10 minutes
    const interval = setInterval(() => {
      dispatch(fetchWeatherData());
    }, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  // Convert celsius to fahrenheit if needed
  const formatTemperature = (celsiusTemp: number) => {
    if (temperatureUnit === 'fahrenheit') {
      const fahrenheit = (celsiusTemp * 9/5) + 32;
      return `${fahrenheit.toFixed(1)}°F`;
    }
    return `${celsiusTemp.toFixed(1)}°C`;
  };
  
  // Get appropriate weather icon
  const getWeatherIcon = (condition: string, icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };
  
  if (loading && (!cities || !Array.isArray(cities) || cities.length === 0)) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weather</h2>
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weather</h2>
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-md">
          <p className="text-red-600 dark:text-red-400">Error loading weather data</p>
        </div>
      </div>
    );
  }
  
  // Safe check before rendering
  const weatherData = Array.isArray(cities) ? cities : [];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Weather</h2>
        {loading && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Refreshing...
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {weatherData.length > 0 ? (
          weatherData.map(city => (
            <Link key={city.cityId} href={`/weather/${city.cityId}`} className="block">
              <div className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-4 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">{city.cityName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{city.condition}</p>
                  </div>
                  <div className="flex items-center">
                    <img 
                      src={getWeatherIcon(city.condition, city.icon)} 
                      alt={city.condition}
                      className="w-10 h-10"
                    />
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                      {formatTemperature(city.temperature)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Humidity: {city.humidity}%</span>
                  <span>Details →</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-500 dark:text-gray-400">No weather data available</p>
          </div>
        )}
      </div>
    </div>
  );
}