'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCityWeather } from '@/redux/slices/weatherSlice';
import Link from 'next/link';

export default function CityWeatherDetail() {
  const params = useParams();
  const cityId = params.cityId as string;
  const dispatch = useAppDispatch();
  const { selectedCity, loading, error } = useAppSelector(state => state.weather);
  const { temperatureUnit } = useAppSelector(state => state.preferences);
  
  useEffect(() => {
    if (cityId) {
      dispatch(fetchCityWeather(cityId));
    }
    
    // Refresh data every 10 minutes
    const interval = setInterval(() => {
      dispatch(fetchCityWeather(cityId));
    }, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [dispatch, cityId]);
  
  // Convert celsius to fahrenheit if needed
  const formatTemperature = (celsiusTemp: number) => {
    if (temperatureUnit === 'fahrenheit') {
      const fahrenheit = (celsiusTemp * 9/5) + 32;
      return `${fahrenheit.toFixed(1)}°F`;
    }
    return `${celsiusTemp.toFixed(1)}°C`;
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };
  
  // Get day name
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'short' });
  };
  
  if (loading && !selectedCity) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/weather" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            ← Back to Weather
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/weather" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            ← Back to Weather
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-md">
            <p className="text-red-600 dark:text-red-400">Error loading weather data: {error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!selectedCity) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/weather" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            ← Back to Weather
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-300">No weather data found for this location.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/weather" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          ← Back to Weather
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Current Weather */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{selectedCity.cityName}</h1>
              <p className="text-xl">{formatDate(selectedCity.lastUpdated)}</p>
              <div className="mt-4">
                <p className="text-5xl font-bold">{formatTemperature(selectedCity.temperature)}</p>
                <p className="text-xl">{selectedCity.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <img 
                src={`https://openweathermap.org/img/wn/${selectedCity.icon}@2x.png`} 
                alt={selectedCity.condition}
                className="w-20 h-20"
              />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-80">Humidity</p>
              <p className="text-lg font-semibold">{selectedCity.humidity}%</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Wind</p>
              <p className="text-lg font-semibold">{selectedCity.wind?.speed} m/s</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Pressure</p>
              <p className="text-lg font-semibold">{selectedCity.pressure} hPa</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Sunrise / Sunset</p>
              <p className="text-lg font-semibold">
                {formatTime(selectedCity.sunrise)} / {formatTime(selectedCity.sunset)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Forecast */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">5-Day Forecast</h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 min-w-max">
              {selectedCity.forecast && selectedCity.forecast.filter((item, index) => index % 8 === 0).map((item, index) => (
                <div key={index} className="flex-shrink-0 w-36 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{getDayName(item.date)}</p>
                  <div className="flex justify-center my-2">
                    <img 
                      src={`https://openweathermap.org/img/wn/${item.icon}.png`} 
                      alt={item.condition}
                      className="w-10 h-10"
                    />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatTemperature(item.temperature)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.condition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Hourly Forecast */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Hourly Forecast</h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 min-w-max">
              {selectedCity.forecast && selectedCity.forecast.slice(0, 8).map((item, index) => (
                <div key={index} className="flex-shrink-0 w-24 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{formatTime(item.date)}</p>
                  <div className="flex justify-center my-2">
                    <img 
                      src={`https://openweathermap.org/img/wn/${item.icon}.png`} 
                      alt={item.condition}
                      className="w-8 h-8"
                    />
                  </div>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{formatTemperature(item.temperature)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}