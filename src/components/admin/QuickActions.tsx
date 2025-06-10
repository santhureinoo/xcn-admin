import React from 'react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
}

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      title: 'Manage Orders',
      subtitle: 'View and process orders',
      icon: '📋',
      color: 'from-blue-500 to-blue-600',
      route: '/transactions'
    },
    {
      title: 'Package Settings',
      subtitle: 'Configure game packages',
      icon: '⚙️',
      color: 'from-purple-500 to-purple-600',
      route: '/packages'
    },
    {
      title: 'User Management',
      subtitle: 'Manage user accounts',
      icon: '👤',
      color: 'from-green-500 to-green-600',
      route: '/users'
    },
    {
      title: 'Analytics',
      subtitle: 'View detailed reports',
      icon: '📊',
      color: 'from-orange-500 to-orange-600',
      route: '/analytics'
    }
  ];

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.route)}
            className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-xl">{action.icon}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {action.subtitle}
                </p>
              </div>
              
              {/* Arrow */}
              <svg 
                className="w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;