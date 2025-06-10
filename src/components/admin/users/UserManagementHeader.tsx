import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserManagementHeaderProps {
  onAddUser: () => void;
  onExportUsers: () => void;
  totalUsers: number;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  onAddUser,
  onExportUsers,
  totalUsers
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Title and Breadcrumb */}
          <div className="mb-4 lg:mb-0">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <button
                onClick={() => navigate('/admin')}
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Admin
              </button>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 dark:text-white">User Management</span>
            </nav>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {totalUsers} users
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage user accounts, roles, and permissions
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onExportUsers}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Users
            </button>
            
            <button
              onClick={onAddUser}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementHeader;