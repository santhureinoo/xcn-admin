import React from 'react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

const StatsOverview: React.FC = () => {
  const stats: StatCard[] = [
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: '📦',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+8%',
      changeType: 'positive',
      icon: '💰',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Active Users',
      value: '892',
      change: '+5%',
      changeType: 'positive',
      icon: '👥',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Pending Orders',
      value: '23',
      change: '-3%',
      changeType: 'negative',
      icon: '⏳',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Overview
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            {/* Icon */}
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
            
            {/* Content */}
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {stat.title}
              </p>
              <div className="flex items-end justify-between mt-1">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                    : stat.changeType === 'negative'
                    ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                    : 'text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-700'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;