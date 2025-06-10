import React from 'react';
import { RetailerPackagePurchase } from '../../../../types/transaction';
import TransactionStatusBadge from '../TransactionStatusBadge';

interface RetailerPackagePurchaseCardProps {
  transaction: RetailerPackagePurchase;
  onViewDetails: (transaction: RetailerPackagePurchase) => void;
  onUpdateStatus?: (transactionId: string, status: string) => void;
}

const RetailerPackagePurchaseCard: React.FC<RetailerPackagePurchaseCardProps> = ({
  transaction,
  onViewDetails,
  onUpdateStatus
}) => {
  const formatXCoin = (amount: number) => {
    return `${amount.toLocaleString()} XCN`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <span className="text-green-600 dark:text-green-400 text-lg">📦</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Package Purchase
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
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
            Retailer
          </span>
        </div>
      </div>

      {/* Package Details */}
      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Package</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {transaction.packageName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Type: {transaction.packageType}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Quantity</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {transaction.quantity}
            </p>
          </div>
        </div>
      </div>

      {/* Cost Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Unit Cost</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatXCoin(transaction.xCoinCost)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {formatXCoin(transaction.totalXCoinCost)}
          </p>
        </div>
      </div>

      {/* Game Info */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Game Information</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">User ID:</span>
            <span className="ml-2 font-mono text-gray-900 dark:text-white">
              {transaction.gameInfo.userId}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Server:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {transaction.gameInfo.serverId}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Region:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {transaction.gameInfo.region}
            </span>
          </div>
          {transaction.gameInfo.playerName && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Player:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {transaction.gameInfo.playerName}
              </span>
            </div>
          )}
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
              <p className="text-xs text-gray-600 dark:text-gray-400">User Notes:</p>
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
              Process
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

export default RetailerPackagePurchaseCard;