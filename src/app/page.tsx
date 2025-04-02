'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WeatherWidget from './components/WeatherWidget';
import CryptoWidget from './components/CryptoWidget';
import NewsWidget from './components/NewsWidget';
import { useAppSelector } from '@/redux/hooks';
import { BellIcon, TrendingUpIcon, SunIcon } from './components/Icons';

export default function Dashboard() {
  const { cities } = useAppSelector(state => state.weather);
  const { data: cryptoData } = useAppSelector(state => state.crypto);
  const { articles } = useAppSelector(state => state.news);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // After initial loading, mark as loaded for animations
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Get the top crypto by market cap
  const topCrypto = cryptoData.length > 0 
    ? cryptoData.reduce((prev, current) => 
        (current.marketCap > prev.marketCap) ? current : prev, cryptoData[0]) 
    : null;
  
  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    }
    return `$${num.toLocaleString()}`;
  };
  
  // Calculate total market cap
  const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0);
  
  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 rounded-lg shadow-lg mb-8">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome to Our Crypto & Weather Dashboard
          </h1>
          <p className="text-blue-100 max-w-3xl">
            Track cryptocurrency prices, check weather forecasts, and stay updated with the latest crypto news — all in one place.
          </p>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
              <SunIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Weather Locations</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{cities?.length || 0} Cities</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Crypto Market Cap</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{formatNumber(totalMarketCap)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mr-4">
              <BellIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Latest News</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{articles?.length || 0} Articles</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <WeatherWidget />
          <CryptoWidget />
        </div>
        <div className="lg:col-span-1 h-full">
          <NewsWidget />
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/weather" className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <SunIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Weather Details</span>
            </Link>
            <Link href="/crypto" className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <TrendingUpIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Crypto Market</span>
            </Link>
            <Link href="/news" className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
              <BellIcon className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Latest News</span>
            </Link>
            {topCrypto && (
              <Link href={`/crypto/${topCrypto.id}`} className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <div className="h-8 w-8 flex items-center justify-center text-lg font-bold text-green-600 dark:text-green-400 mb-2">{topCrypto.symbol.substring(0, 2).toUpperCase()}</div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{topCrypto.name} Details</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}