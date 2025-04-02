'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchNewsData } from '@/redux/slices/newsSlice';

export default function NewsPage() {
  const dispatch = useAppDispatch();
  const { articles, loading, error } = useAppSelector(state => state.news);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get unique news sources for filter
  const sources = Array.from(new Set(articles.map(article => article.source)));
  
  // Filter articles based on search term and selected source
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSource = selectedSource === '' || article.source === selectedSource;
    
    return matchesSearch && matchesSource;
  });
  
  if (loading && articles.length === 0) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-md"></div>
        {[1, 2, 3, 4, 5].map(index => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="flex justify-between mt-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-md">
        <p className="text-red-600 dark:text-red-400">Error loading news data: {error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4 items-center">
            <div>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                <option value="">All Sources</option>
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            
            <div>
              {loading && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Refreshing...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedSource ? 'No articles match your filters.' : 'No articles available.'}
            </p>
          </div>
        ) : (
          filteredArticles.map(article => (
            <a 
              key={article.id} 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {article.imageUrl && (
                  <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Replace with a placeholder if image fails to load
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  </div>
                )}
                <div className={`p-6 ${article.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{article.title}</h3>
                  {article.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.description}</p>
                  )}
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{article.source}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredArticles.length} of {articles.length} articles
      </div>
    </div>
  );
}