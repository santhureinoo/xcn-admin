import React from 'react';
import { TransactionType } from '../../../types/transaction';

interface TransactionTypeBadgeProps {
  type: TransactionType;
  className?: string;
}

const TransactionTypeBadge: React.FC<TransactionTypeBadgeProps> = ({ type, className = '' }) => {
  const getTypeConfig = (type: TransactionType) => {
    switch (type) {
      case 'retailer_xcoin_purchase':
        return {
          label: 'XCoin Purchase',
          icon: '💰',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      case 'retailer_package_purchase':
        return {
          label: 'Package Purchase',
          icon: '📦',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 'reseller_xcoin_request':
        return {
          label: 'XCoin Request',
          icon: '🔄',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        };
      case 'reseller_bulk_purchase':
        return {
          label: 'Bulk Purchase',
          icon: '📋',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          textColor: 'text-purple-800 dark:text-purple-300',
          borderColor: 'border-purple-200 dark:border-purple-800'
        };
      case 'vendor_exchange':
        return {
          label: 'Vendor Exchange',
          icon: '🔁',
          bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
          textColor: 'text-indigo-800 dark:text-indigo-300',
          borderColor: 'border-indigo-200 dark:border-indigo-800'
        };
      default:
        return {
          label: 'Unknown',
          icon: '❓',
          bgColor: 'bg-gray-100 dark:bg-gray-700',
          textColor: 'text-gray-800 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-600'
        };
    }
  };

  const config = getTypeConfig(type);

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default TransactionTypeBadge;