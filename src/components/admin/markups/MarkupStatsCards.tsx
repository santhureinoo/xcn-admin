import React from 'react';
import LoadingSpinner from '../../ui/LoadingSpinner';

interface MarkupStatsCardsProps {
  stats: {
    totalMarkups: number;
    activeMarkups: number;
    inactiveMarkups: number;
    percentageMarkups: number;
    flatMarkups: number;
    markupsWithPackages: number;
    unusedMarkups: number;
  };
  loading: boolean;
}

const MarkupStatsCards: React.FC<MarkupStatsCardsProps> = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Markups',
      value: stats.totalMarkups,
      icon: '📊',
      color: 'blue',
      description: 'All markup rules'
    },
    {
      title: 'Active Markups',
      value: stats.activeMarkups,
      icon: '✅',
      color: 'green',
      description: 'Currently active'
    },
    {
      title: 'Percentage Rules',
      value: stats.percentageMarkups,
      icon: '📈',
      color: 'purple',
      description: 'Percentage-based'
    },
    {
      title: 'Flat Amount Rules',
      value: stats.flatMarkups,
      icon: '💰',
      color: 'yellow',
      description: 'Fixed amount'
    },
    {
      title: 'In Use',
      value: stats.markupsWithPackages,
      icon: '🔗',
      color: 'indigo',
      description: 'Applied to packages'
    },
    {
      title: 'Unused',
      value: stats.unusedMarkups,
      icon: '⚠️',
      color: 'gray',
      description: 'Not applied yet'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      gray: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    };
    return colorMap[color] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <LoadingSpinner size="small" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`rounded-lg shadow p-6 border ${getColorClasses(card.color)}`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="ml-3 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {card.title}
                </dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                  {card.value.toLocaleString()}
                </dd>
                <dd className="text-xs text-gray-500 dark:text-gray-400">
                  {card.description}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarkupStatsCards;