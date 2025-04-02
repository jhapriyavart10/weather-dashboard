'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchNewsData } from '@/redux/slices/newsSlice';

export default function NewsWidget() {
  const dispatch = useAppDispatch();
  const { articles, loading, error } = useAppSelector(state => state.news);
  
  useEffect(() => {
    dispatch(fetchNewsData());
    
    // Refresh news every hour
    const interval = setInterval(() => {
      dispatch(fetchNewsData());
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  // Format publication date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading && articles.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">News</h2>
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">News</h2>
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-md">
          <p className="text-red-600 dark:text-red-400">Error loading news data</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Crypto News</h2>
        <Link href="/news" className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          View all →
        </Link>
      </div>
      
      <div className="space-y-4 overflow-hidden">
        {articles.slice(0, 3).map(article => (
          <a 
            key={article.id} 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-4 transition-colors">
              <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                {article.title}
              </h3>
              {article.description && (
                <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2 mb-2">
                  {article.description}
                </p>
              )}
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{article.source}</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}