import React from 'react';
import { TransactionStats } from '../../../services/transactionService';

interface TransactionStatsCardsProps {
  stats: TransactionStats;
  loading: boolean;
}

const TransactionStatsCards: React.FC<TransactionStatsCardsProps> = ({ stats, loading }) => {
  const statsCards = [
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: '📊',
      color: 'blue'
    },
    {
      title: 'XCoins Purchased',
      value: stats.totalXCoinPurchased.toLocaleString(),
      icon: '💰',
      color: 'green'
    },
    {
      title: 'XCoins Spent',
      value: stats.totalXCoinSpent.toLocaleString(),
      icon: '💸',
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '💵',
      color: 'emerald'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: '⏳',
      color: 'yellow'
    },
    {
      title: 'Completed Today',
      value: stats.completedToday,
      icon: '✅',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {statsCards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${getColorClasses(card.color)}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionStatsCards;