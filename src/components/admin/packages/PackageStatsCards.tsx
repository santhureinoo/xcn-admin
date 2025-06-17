import React from 'react';

interface PackageStats {
  totalPackages: number;
  activePackages: number;
  inactivePackages: number;
  outOfStockPackages: number;
  totalStock: number;
  averagePrice: number;
  topRegions: any[];
  topGames: any[];
  topVendors: any[];
}

interface PackageStatsCardsProps {
  stats: PackageStats;
  loading?: boolean;
}

const PackageStatsCards: React.FC<PackageStatsCardsProps> = ({ stats, loading = false }) => {
  const statsCards = [
    {
      title: 'Total Packages',
      value: stats.totalPackages,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
        </svg>
      ),
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: '+12%',
      trendColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Active Packages',
      value: stats.activePackages,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Inactive Packages',
      value: stats.inactivePackages,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockPackages,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      alert: stats.outOfStockPackages > 0
    },
    {
      title: 'Total Stock',
      value: stats.totalStock,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Average Price',
      value: `${stats.averagePrice.toFixed(2)} xCoin`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  if (loading) {
    return (
      <div className="mb-8">
        {/* Loading skeleton with multiple rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Multi-row responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 p-6 group"
          >
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className={`flex-shrink-0 ${card.bgColor} rounded-lg p-3 group-hover:scale-105 transition-transform duration-200`}>
                <div className={`${card.textColor} dark:text-white`}>
                  {card.icon}
                </div>
              </div>
              
              {/* Trend or Alert Badge */}
              {card.trend && (
                <div className="flex items-center text-sm font-medium">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className={card.trendColor}>{card.trend}</span>
                </div>
              )}
              
              {card.alert && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </p>
            </div>
            
            {/* Footer Info */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              {card.title === 'Total Packages' && card.trend && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>from last month</span>
                </div>
              )}
              
              {card.title === 'Out of Stock' && stats.outOfStockPackages > 0 && (
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-600 dark:text-red-400 font-medium">Needs attention</span>
                </div>
              )}
              
              {card.title === 'Active Packages' && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Currently available</span>
                </div>
              )}
              
              {card.title === 'Total Stock' && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>Items in inventory</span>
                </div>
              )}
              
              {card.title === 'Average Price' && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>Across all packages</span>
                </div>
              )}
              
              {card.title === 'Inactive Packages' && stats.inactivePackages > 0 && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  <span>Temporarily disabled</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageStatsCards;