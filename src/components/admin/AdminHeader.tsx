import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AdminHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Status Bar Simulation */}
      <div className="h-6 bg-black dark:bg-white flex items-center justify-between px-4 text-white dark:text-black text-sm font-medium">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-white dark:bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-white dark:bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-white dark:bg-black rounded-full"></div>
          </div>
          <span className="text-xs">100%</span>
          <div className="w-6 h-3 border border-white dark:border-black rounded-sm">
            <div className="w-full h-full bg-green-500 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Header Content */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user?.firstName || 'Admin'}
            </p>
          </div>
          
          {/* Profile Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold text-lg">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;