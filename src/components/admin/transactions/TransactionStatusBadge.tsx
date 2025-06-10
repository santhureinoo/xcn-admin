import React from 'react';
import { TransactionStatus } from '../../../types/transaction';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          icon: '✅',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 'pending':
        return {
          label: 'Pending',
          icon: '⏳',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        };
      case 'processing':
        return {
          label: 'Processing',
          icon: '⚡',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      case 'failed':
        return {
          label: 'Failed',
          icon: '❌',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-800 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: '🚫',
          bgColor: 'bg-gray-100 dark:bg-gray-700',
          textColor: 'text-gray-800 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-600'
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

  const config = getStatusConfig(status);

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default TransactionStatusBadge;