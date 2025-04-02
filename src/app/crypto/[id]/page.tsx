'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCryptoDetails, fetchCryptoHistory } from '@/redux/slices/cryptoSlice';
import Link from 'next/link';

export default function CryptoDetailPage() {
  const params = useParams();
  const cryptoId = params.id as string;
  const dispatch = useAppDispatch();
  const { selectedCrypto, historicalData, loading, error } = useAppSelector(state => state.crypto);
  const [timeRange, setTimeRange] = useState(7); // Days
  
  useEffect(() => {
    if (cryptoId) {
      dispatch(fetchCryptoDetails(cryptoId));
      dispatch(fetchCryptoHistory({ cryptoId, days: timeRange }));
    }
  }, [dispatch, cryptoId, timeRange]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
  };
  
  // Format large numbers
  const formatNumber = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K`;
    }
    return value.toString();
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  if (loading && !selectedCrypto) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/crypto" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            ← Back to Cryptocurrencies
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
          <Link href="/crypto" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            ← Back to Cryptocurrencies
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-md">
            <p className="text-red-600 dark:text-red-400">Error loading cryptocurrency data: {error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!selectedCrypto) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/crypto" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            ← Back to Cryptocurrencies
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-300">No data found for this cryptocurrency.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/crypto" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          ← Back to Cryptocurrencies
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center">
            {selectedCrypto.image && (
              <img 
                src={selectedCrypto.image} 
                alt={selectedCrypto.name} 
                className="w-16 h-16 rounded-full mr-4"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{selectedCrypto.name}</h1>
              <p className="text-xl">{selectedCrypto.symbol}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-bold">{formatCurrency(selectedCrypto.price)}</p>
              <p className={`text-xl ${selectedCrypto.priceChange24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {selectedCrypto.priceChange24h >= 0 ? '▲' : '▼'} {selectedCrypto.priceChange24h?.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        
        {/* Price Chart */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Price Chart</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange(7)}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 7 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setTimeRange(30)}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 30 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setTimeRange(90)}
                className={`px-3 py-1 rounded-md ${
                  timeRange === 90 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                90D
              </button>
            </div>
          </div>
          
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            {/* Chart would go here - in a production app, you'd use a charting library like Chart.js or Recharts */}
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                {historicalData && historicalData[cryptoId] ? 
                  'Price chart would render here with real data' :
                  'Loading chart data...'
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Market Stats */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Market Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedCrypto.marketCap)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">24h Trading Volume</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedCrypto.totalVolume || 0)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Circulating Supply</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(selectedCrypto.circulatingSupply || 0)} {selectedCrypto.symbol}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Supply</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(selectedCrypto.totalSupply || 0)} {selectedCrypto.symbol}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Max Supply</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedCrypto.maxSupply ? formatNumber(selectedCrypto.maxSupply) + ' ' + selectedCrypto.symbol : 'Unlimited'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">All-Time High</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(selectedCrypto.ath || 0)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedCrypto.athDate && formatDate(selectedCrypto.athDate)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Description */}
        {selectedCrypto.description && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About {selectedCrypto.name}</h2>
            <div 
              className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedCrypto.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}