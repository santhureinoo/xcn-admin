import React from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import StatsOverview from '../components/admin/StatsOverview';
import QuickActions from '../components/admin/QuickActions';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Responsive Container */}
      <div className="max-w-md lg:max-w-7xl mx-auto bg-white dark:bg-gray-800 min-h-screen lg:shadow-xl">
        {/* Header */}
        {/* <AdminHeader /> */}
        
        {/* Content */}
        <div className="bg-gray-50 dark:bg-gray-900">
          {/* Stats Overview */}
          <StatsOverview />
          
          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default HomePage;