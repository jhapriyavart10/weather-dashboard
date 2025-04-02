'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCryptoData } from '@/redux/slices/cryptoSlice';
import { websocketService } from '@/services/websocketService';

export default function CryptoPage() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(state => state.crypto);
  
  useEffect(() => {
    dispatch(fetchCryptoData());
    
    // Connect to WebSocket for live updates
    websocketService.connect();
    
    return () => {
      websocketService.disconnect();
    };
  }, [dispatch]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
  };
  
  // Format large numbers
  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1_000_000_000) {
      return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
    }
    if (marketCap >= 1_000_000) {
      return `$${(marketCap / 1_000_000).toFixed(2)}M`;
    }
    return formatCurrency(marketCap);
  };
  
  if (loading && data.length === 0) {
    return (
      <div className="animate-pulse">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="h-16 bg-gray-200 dark:bg-gray-700"></div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            {[1, 2, 3].map(index => (
              <div key={index} className="px-4 py-5 sm:px-6 h-20 bg-gray-50 dark:bg-gray-800"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-md">
        <p className="text-red-600 dark:text-red-400">Error loading cryptocurrency data: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Cryptocurrency Market</h2>
        {loading && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Live Updates
          </span>
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="hidden sm:flex bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6">
          <div className="w-1/2 font-medium text-gray-500 dark:text-gray-300">Cryptocurrency</div>
          <div className="w-1/6 text-right font-medium text-gray-500 dark:text-gray-300">Price</div>
          <div className="w-1/6 text-right font-medium text-gray-500 dark:text-gray-300">24h Change</div>
          <div className="w-1/6 text-right font-medium text-gray-500 dark:text-gray-300">Market Cap</div>
        </div>
        
        {data.map(crypto => (
          <Link key={crypto.id} href={`/crypto/${crypto.id}`}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="sm:hidden mb-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 mr-3 overflow-hidden">
                      <span className="text-xs font-bold">{crypto.symbol.substring(0, 2)}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">{crypto.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{formatCurrency(crypto.price)}</p>
                    <p className={`text-sm ${crypto.priceChange24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {crypto.priceChange24h >= 0 ? '+' : ''}{crypto.priceChange24h?.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Market Cap: {formatMarketCap(crypto.marketCap)}
                </p>
              </div>
              
              <div className="hidden sm:flex items-center">
                <div className="w-1/2 flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 mr-3 overflow-hidden">
                    <span className="text-xs font-bold">{crypto.symbol.substring(0, 2)}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">{crypto.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="w-1/6 text-right">
                  <span className="text-base font-medium text-gray-900 dark:text-white">{formatCurrency(crypto.price)}</span>
                </div>
                <div className="w-1/6 text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
                    crypto.priceChange24h >= 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {crypto.priceChange24h >= 0 ? '+' : ''}{crypto.priceChange24h?.toFixed(2)}%
                  </span>
                </div>
                <div className="w-1/6 text-right text-base text-gray-900 dark:text-white">
                  {formatMarketCap(crypto.marketCap)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}