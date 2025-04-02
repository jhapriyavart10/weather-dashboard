'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCryptoData } from '@/redux/slices/cryptoSlice';
import { websocketService } from '@/services/websocketService';

export default function CryptoWidget() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(state => state.crypto);
  const [connectionStatus, setConnectionStatus] = useState({ 
    isConnected: false, 
    isUsingWebSocket: false,
    isPolling: false 
  });
  
  useEffect(() => {
    dispatch(fetchCryptoData());
    try {
      websocketService.connect();
      
      // Initial connection status check
      setConnectionStatus(websocketService.getConnectionStatus());
      
      // Update connection status periodically
      const statusInterval = setInterval(() => {
        setConnectionStatus(websocketService.getConnectionStatus());
      }, 5000);
      
      // Set up polling fallback in case WebSocket fails
      const fallbackTimer = setTimeout(() => {
        // Check if WebSocket failed to connect after 5 seconds
        const status = websocketService.getConnectionStatus();
        if (!status.isUsingWebSocket) {
          console.log('WebSocket connection not established, using polling fallback');
          dispatch(fetchCryptoData());
          
          // Set up polling interval
          const pollingInterval = setInterval(() => {
            dispatch(fetchCryptoData());
          }, 30000); // Poll every 30 seconds
          
          return () => clearInterval(pollingInterval);
        }
      }, 5000);
      
      // Clean up WebSocket connection and intervals on unmount
      return () => {
        clearTimeout(fallbackTimer);
        clearInterval(statusInterval);
        websocketService.disconnect();
      };
    } catch (err) {
      console.error('Error setting up crypto data connection:', err);
      // Fallback to regular polling if WebSocket setup fails
      dispatch(fetchCryptoData());
      
      const interval = setInterval(() => {
        dispatch(fetchCryptoData());
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [dispatch]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1_000_000_000) {
      return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
    }
    if (marketCap >= 1_000_000) {
      return `$${(marketCap / 1_000_000).toFixed(2)}M`;
    }
    return formatPrice(marketCap);
  };
  
  if (loading && data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cryptocurrency</h2>
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
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cryptocurrency</h2>
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-md">
          <p className="text-red-600 dark:text-red-400">Error loading cryptocurrency data</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Cryptocurrency</h2>
        {connectionStatus.isConnected && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
            connectionStatus.isUsingWebSocket 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {connectionStatus.isUsingWebSocket ? 'Live Updates' : 'Polling Updates'}
          </span>
        )}
        {loading && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Refreshing...
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {data.map(crypto => (
          <Link key={crypto.id} href={`/crypto/${crypto.id}`} className="block">
            <div className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 mr-3 overflow-hidden">
                    <span className="text-xs font-bold">{crypto.symbol.substring(0, 2)}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">{crypto.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatPrice(crypto.price)}
                  </span>
                  <span className={`text-sm ${
                    crypto.priceChange24h >= 0 
                    ? 'text-green-500 dark:text-green-400' 
                    : 'text-red-500 dark:text-red-400'
                  }`}>
                    {crypto.priceChange24h >= 0 ? '+' : ''}{crypto.priceChange24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Mkt Cap: {formatMarketCap(crypto.marketCap)}</span>
                <span>Details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}