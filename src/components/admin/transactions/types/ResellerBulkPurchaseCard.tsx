import React, { useState } from 'react';
import { ResellerBulkPurchase } from '../../../../types/transaction';
import TransactionStatusBadge from '../TransactionStatusBadge';

interface ResellerBulkPurchaseCardProps {
  transaction: ResellerBulkPurchase;
  onViewDetails: (transaction: ResellerBulkPurchase) => void;
  onUpdateStatus?: (transactionId: string, status: string) => void;
}

const ResellerBulkPurchaseCard: React.FC<ResellerBulkPurchaseCardProps> = ({
  transaction,
  onViewDetails,
  onUpdateStatus
}) => {
  const [showAllPackages, setShowAllPackages] = useState(false);
  
  const formatXCoin = (amount: number) => {
    return `${amount.toLocaleString()} XCN`;
  };

  const displayedPackages = showAllPackages 
    ? transaction.packages 
    : transaction.packages.slice(0, 2);

  const totalSavings = transaction.totalXCoinCost - transaction.finalXCoinCost;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <span className="text-purple-600 dark:text-purple-400 text-lg">📋</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bulk Purchase
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ID: {transaction.id}
            </p>
          </div>
        </div>
        <TransactionStatusBadge status={transaction.status} />
      </div>

      {/* User Info */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {transaction.userName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {transaction.userEmail}
            </p>
          </div>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full">
            Reseller
          </span>
        </div>
      </div>

      {/* Bulk Summary */}
      <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Packages</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {transaction.totalPackages}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Package Types</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {new Set(transaction.packages.map(p => p.packageType)).size}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Bulk Discount</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {transaction.bulkDiscount || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Package List */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Packages</p>
          {transaction.packages.length > 2 && (
            <button
              onClick={() => setShowAllPackages(!showAllPackages)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {showAllPackages ? 'Show Less' : `Show All (${transaction.packages.length})`}
            </button>
          )}
        </div>
        
        <div className="space-y-2">
          {displayedPackages.map((pkg, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {pkg.packageName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {pkg.packageType} • Qty: {pkg.quantity}
                  </p>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    <span>User ID: {pkg.gameInfo.userId}</span>
                    <span className="mx-2">•</span>
                    <span>Server: {pkg.gameInfo.serverId}</span>
                    <span className="mx-2">•</span>
                    <span>Region: {pkg.gameInfo.region}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatXCoin(pkg.xCoinCost * pkg.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatXCoin(transaction.totalXCoinCost)}
            </span>
          </div>
          {transaction.bulkDiscount && transaction.bulkDiscount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Bulk Discount ({transaction.bulkDiscount}%)
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                -{formatXCoin(totalSavings)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-900 dark:text-white">Final Total</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatXCoin(transaction.finalXCoinCost)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>Created: {new Date(transaction.createdAt).toLocaleString()}</span>
        <span>Updated: {new Date(transaction.updatedAt).toLocaleString()}</span>
      </div>

      {/* Notes */}
      {(transaction.notes || transaction.adminNotes) && (
        <div className="mb-4 space-y-2">
          {transaction.notes && (
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-xs text-gray-600 dark:text-gray-400">Reseller Notes:</p>
              <p className="text-sm text-gray-900 dark:text-white">{transaction.notes}</p>
            </div>
          )}
          {transaction.adminNotes && (
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <p className="text-xs text-gray-600 dark:text-gray-400">Admin Notes:</p>
              <p className="text-sm text-gray-900 dark:text-white">{transaction.adminNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => onViewDetails(transaction)}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          View Details
        </button>
        
        {transaction.status === 'pending' && onUpdateStatus && (
          <div className="flex space-x-2">
            <button
              onClick={() => onUpdateStatus(transaction.id, 'processing')}
              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Process All
            </button>
            <button
              onClick={() => onUpdateStatus(transaction.id, 'failed')}
              className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResellerBulkPurchaseCard;