import React from 'react';
import { Package } from '../../../types/package';

interface PackageDetailModalProps {
  package: Package | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (pkg: Package) => void;
  onDelete: (pkg: Package) => void;
  onToggleStatus: (pkg: Package) => void;
  onPackageUpdated: (pkg: Package) => void;
}

const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  package: pkg,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
  onPackageUpdated
}) => {
  if (!isOpen || !pkg) return null;

  const getStatusColor = (status: Package['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: Package['type']) => {
    switch (type) {
      case 'diamond':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'weekly':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'monthly':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'special':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'subscription':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleEdit = () => {
    onEdit(pkg);
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      try {
        await onDelete(pkg);
        onPackageUpdated(pkg);
        onClose();
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      await onToggleStatus(pkg);
      onPackageUpdated(pkg);
    } catch (error) {
      console.error('Error toggling package status:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Package Details
              </h2>
              {pkg.featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Image and Basic Info */}
              <div className="lg:col-span-1">
                {/* Package Image */}
                <div className="mb-6">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {pkg.imageUrl ? (
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-package.png';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-48">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Type */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                      {pkg.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(pkg.type)}`}>
                      {pkg.type.toUpperCase()}
                    </span>
                  </div>

                  {pkg.stock !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Stock
                      </label>
                      <span className={`text-sm font-medium ${pkg.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {pkg.stock} units
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Column - Package Information */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Game
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {pkg.gameName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Region
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {pkg.region}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Game ID
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white font-mono">
                        {pkg.gameId}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Vendor
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {pkg.vendor}
                      </p>
                    </div>
                  </div>

                  {pkg.amount && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Amount
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {pkg.amount} {pkg.type === 'diamond' ? 'Diamonds' : 'Credits'}
                      </p>
                    </div>
                  )}

                  {pkg.duration && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {pkg.duration} days
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Pricing and Vendor Info */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  {/* Pricing Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Pricing
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Selling Price:
                        </span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {pkg.price} xCoin
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Vendor Price:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {pkg.vendorPrice} {pkg.currency}
                        </span>
                      </div>

                      {pkg.discount && pkg.discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Discount:
                          </span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {pkg.discount}%
                          </span>
                        </div>
                      )}

                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Profit Margin:
                          </span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {((pkg.price - pkg.vendorPrice) / pkg.vendorPrice * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Vendor Details
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Vendor Name
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {pkg.vendor}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Package Code
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white font-mono">
                          {pkg.vendorPackageCode}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Currency
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {pkg.currency}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Timestamps
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Created At
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {new Date(pkg.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last Updated
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {new Date(pkg.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleStatus}
                  className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${pkg.status === 'active'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500 dark:bg-green-900 dark:text-green-300'
                    }`}
                >
                  {pkg.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900 dark:text-red-300"
                >
                  Delete Package
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>

                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailModal;
