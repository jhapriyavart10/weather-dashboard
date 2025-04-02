'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchWeatherData } from '@/redux/slices/weatherSlice';
import { setTemperatureUnit } from '@/redux/slices/preferencesSlice';

export default function WeatherPage() {
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
  
  // Toggle temperature unit
  const toggleTemperatureUnit = () => {
    dispatch(setTemperatureUnit(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius'));
  };
  
  // Get weather icon
  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };
  
  if (loading && cities.length === 0) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(index => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow h-48"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-md">
        <p className="text-red-600 dark:text-red-400">Error loading weather data: {error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Showing weather for {cities.length} cities
        </p>
        <button
          onClick={toggleTemperatureUnit}
          className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
        >
          Switch to {temperatureUnit === 'celsius' ? '°F' : '°C'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map(city => (
          <Link key={city.cityId} href={`/weather/${city.cityId}`} className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{city.cityName}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{city.condition}</p>
                  </div>
                  <img 
                    src={getWeatherIcon(city.icon)} 
                    alt={city.condition}
                    className="w-16 h-16"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{formatTemperature(city.temperature)}</p>
                </div>
                <div className="mt-6 flex justify-between text-gray-600 dark:text-gray-300">
                  <div>
                    <p className="text-sm">Humidity</p>
                    <p className="font-semibold">{city.humidity}%</p>
                  </div>
                  <div className="text-blue-500 font-medium">View Details →</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}