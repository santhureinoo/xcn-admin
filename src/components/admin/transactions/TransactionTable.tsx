import React from 'react';
import { Transaction } from '../../../services/transactionService';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  onTransactionClick: (transaction: Transaction) => void;
  onUpdateStatus: (transactionId: string, status: string, adminNotes?: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  onTransactionClick,
  onUpdateStatus
}) => {
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      rejected: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || statusClasses.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeClasses = {
      retailer_xcoin_purchase: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      retailer_package_purchase: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      reseller_bulk_purchase: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    };

    const typeLabels = {
      retailer_xcoin_purchase: 'XCoin Purchase',
      retailer_package_purchase: 'Package Purchase',
      reseller_bulk_purchase: 'Bulk Purchase'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClasses[type as keyof typeof typeClasses] || typeClasses.retailer_xcoin_purchase}`}>
        {typeLabels[type as keyof typeof typeLabels] || type}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleClasses = {
      retailer: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      reseller: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleClasses[role as keyof typeof roleClasses] || roleClasses.retailer}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number, type: string) => {
    if (type === 'retailer_xcoin_purchase') {
      return `+${amount.toLocaleString()} XCoins`;
    } else {
      return `-${Math.abs(amount).toLocaleString()} XCoins`;
    }
  };

  const handleQuickAction = (transaction: Transaction, action: string) => {
    if (action === 'approve') {
      onUpdateStatus(transaction.id, 'completed', 'Approved by admin');
    } else if (action === 'reject') {
      const reason = prompt('Reason for rejection:');
      if (reason) {
        onUpdateStatus(transaction.id, 'rejected', reason);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onTransactionClick(transaction)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.id.slice(0, 8)}...
                    </div>
                    {transaction.paymentReference && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Ref: {transaction.paymentReference}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.userName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.userEmail}
                    </div>
                    <div className="mt-1">
                      {getRoleBadge(transaction.userRole)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTypeBadge(transaction.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${transaction.type === 'retailer_xcoin_purchase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatAmount(transaction.amount, transaction.type)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {transaction.totalCost ? `$${transaction.totalCost.toLocaleString()}` : '-'}
                  </div>
                  {transaction.paymentMethod && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      via {transaction.paymentMethod}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(transaction.createdAt)}
                  </div>
                  {transaction.updatedAt !== transaction.createdAt && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Updated: {formatDate(transaction.updatedAt)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    {transaction.status === 'pending' && transaction.type === 'retailer_xcoin_purchase' && (
                      <>
                        <button
                          onClick={() => handleQuickAction(transaction, 'approve')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleQuickAction(transaction, 'reject')}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onTransactionClick(transaction)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No transactions match your current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;