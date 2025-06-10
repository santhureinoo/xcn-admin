import React from 'react';
import { Package } from '../../../types/package';
import LoadingSpinner from '../../ui/LoadingSpinner';

interface PackageTableProps {
  packages: Package[];
  loading: boolean;
  onPackageClick: (pkg: Package) => void;
  onEditPackage: (pkg: Package) => void;
  onDeletePackage: (pkg: Package) => void;
  onToggleStatus: (pkg: Package) => void;
}

const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  loading,
  onPackageClick,
  onEditPackage,
  onDeletePackage,
  onToggleStatus
}) => {
  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
      case 'out_of_stock':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'diamond':
        return '💎';
      case 'weekly':
        return '📅';
      case 'monthly':
        return '🗓️';
      case 'special':
        return '⭐';
      default:
        return '📦';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No packages found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Get started by creating your first package.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Region/Game
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {packages.map((pkg) => (
              <tr 
                key={pkg.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onPackageClick(pkg)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img 
                        className="h-12 w-12 rounded-lg object-cover" 
                        src={pkg.imageUrl} 
                        alt={pkg.name}
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-package.png';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getTypeIcon(pkg.type)}</span>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {pkg.name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Code: {pkg.vendorPackageCode}
                      </div>
                      {pkg.amount && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {pkg.amount} {pkg.type === 'diamond' ? 'diamonds' : 'items'}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{pkg.region}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{pkg.gameName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{pkg.vendor}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {pkg.currency} {pkg.vendorPrice.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ${pkg.price.toFixed(2)}
                  </div>
                  {pkg.discount && (
                    <div className="text-xs text-green-600 dark:text-green-400">
                      {pkg.discount}% off
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {pkg.stock !== undefined ? pkg.stock : 'Unlimited'}
                  </div>
                  {pkg.stock !== undefined && pkg.stock < 10 && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Low stock
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(pkg.status)}>
                    {pkg.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPackage(pkg);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(pkg);
                      }}
                      className={`${
                        pkg.status === 'active' 
                          ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' 
                          : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                      }`}
                    >
                      {pkg.status === 'active' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePackage(pkg);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageTable;