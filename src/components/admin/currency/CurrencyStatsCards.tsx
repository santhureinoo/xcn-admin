import React from 'react';

interface CurrencyStats {
  totalXCoinsInCirculation: number;
  totalXCoinsPurchased24h: number;
  totalXCoinsSpent24h: number;
  totalRevenue24h: number;
  averageExchangeRate: number;
  activeUsers24h: number;
}

interface CurrencyStatsCardsProps {
  stats: CurrencyStats;
  loading?: boolean;
}

const CurrencyStatsCards: React.FC<CurrencyStatsCardsProps> = ({ stats, loading }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const statCards = [
    {
      title: 'Total X Coins in Circulation',
      value: formatNumber(stats.totalXCoinsInCirculation),
      suffix: 'XCN',
      icon: '🪙',
      color: 'blue',
      change: '+5.2%',
      changeType: 'positive' as const
    },
    {
      title: 'X Coins Purchased (24h)',
      value: formatNumber(stats.totalXCoinsPurchased24h),
      suffix: 'XCN',
      icon: '📈',
      color: 'green',
      change: '+12.3%',
      changeType: 'positive' as const
    },
    {
      title: 'X Coins Spent (24h)',
      value: formatNumber(stats.totalXCoinsSpent24h),
      suffix: 'XCN',
      icon: '💸',
      color: 'purple',
      change: '+8.7%',
      changeType: 'positive' as const
    },
    {
      title: 'Revenue (24h)',
      value: `$${formatNumber(stats.totalRevenue24h)}`,
      suffix: '',
      icon: '💰',
      color: 'yellow',
      change: '+15.1%',
      changeType: 'positive' as const
    },
    {
      title: 'Average Exchange Rate',
      value: stats.averageExchangeRate.toFixed(2),
      suffix: 'XCN/USD',
      icon: '🔄',
      color: 'indigo',
      change: '-2.1%',
      changeType: 'negative' as const
    },
    {
      title: 'Active Users (24h)',
      value: formatNumber(stats.activeUsers24h),
      suffix: '',
      icon: '👥',
      color: 'pink',
      change: '+7.8%',
      changeType: 'positive' as const
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full ${getColorClasses(card.color)}`}>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className={`text-sm font-medium ${
              card.changeType === 'positive' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {card.change}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {card.title}
            </h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
              {card.suffix && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {card.suffix}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurrencyStatsCards;