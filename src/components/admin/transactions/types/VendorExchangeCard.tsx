import React from 'react';
import { VendorExchange } from '../../../../types/transaction';
import TransactionStatusBadge from '../TransactionStatusBadge';

interface VendorExchangeCardProps {
  transaction: VendorExchange;
  onViewDetails: (transaction: VendorExchange) => void;
  onUpdateStatus?: (transactionId: string, status: string) => void;
}

const VendorExchangeCard: React.FC<VendorExchangeCardProps> = ({
  transaction,
  onViewDetails,
  onUpdateStatus
}) => {
  const formatXCoin = (amount: number) => {
    return `${amount.toLocaleString()} XCN`;
  };

  const formatVendorCoin = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 dark:text-indigo-400 text-lg">🔁</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vendor Exchange
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
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            transaction.userRole === 'retailer' 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
          }`}>
            {transaction.userRole.charAt(0).toUpperCase() + transaction.userRole.slice(1)}
          </span>
        </div>
      </div>

      {/* Exchange Details */}
      <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="text-center flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">From XCoin</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              -{formatXCoin(transaction.xCoinAmount)}
            </p>
          </div>
          <div className="mx-4">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400">→</span>
            </div>
          </div>
          <div className="text-center flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">To {transaction.vendorCurrency}</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              +{formatVendorCoin(transaction.vendorCoinAmount, transaction.vendorCurrency)}
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Exchange Rate</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            1 XCN = {transaction.exchangeRate} {transaction.vendorCurrency}
          </p>
        </div>
      </div>

      {/* Vendor Info */}
      <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Vendor</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {transaction.vendorName}
            </p>
          </div>
          {transaction.vendorTransactionId && (
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Vendor TX ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white">
                {transaction.vendorTransactionId}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Package Info */}
      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Related Package</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {transaction.packageName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Original Transaction</p>
            <p className="text-sm font-mono text-blue-600 dark:text-blue-400">
              {transaction.relatedTransactionId}
            </p>
          </div>
        </div>
      </div>

      {/* Vendor Response */}
      {transaction.vendorResponse && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Vendor Response</p>
          <div className="text-sm font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-2 rounded border">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(transaction.vendorResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}

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
              <p className="text-xs text-gray-600 dark:text-gray-400">System Notes:</p>
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
        
        {transaction.status === 'failed' && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(transaction.id, 'pending')}
            className="px-3 py-1 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors"
          >
            Retry Exchange
          </button>
        )}
      </div>
    </div>
  );
};

export default VendorExchangeCard;