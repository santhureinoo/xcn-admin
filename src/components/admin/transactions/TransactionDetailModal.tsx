import React, { useState } from 'react';
import { Transaction } from '../../../services/transactionService';

interface TransactionDetailModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (transactionId: string, status: string, adminNotes?: string) => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
    transaction,
    isOpen,
    onClose,
    onUpdateStatus
}) => {
    const [adminNotes, setAdminNotes] = useState('');
    const [updating, setUpdating] = useState(false);

    if (!isOpen || !transaction) return null;

    const handleStatusUpdate = async (status: string) => {
        setUpdating(true);
        try {
            await onUpdateStatus(transaction.id, status, adminNotes);
            setAdminNotes('');
            onClose();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
            completed: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
            failed: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300',
            rejected: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
        };
        return colors[status as keyof typeof colors] || colors.pending;
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                Transaction Details
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Transaction Info */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Transaction Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Transaction ID:</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{transaction.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {transaction.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
                                            <span className={`text-sm font-medium ${transaction.type === 'retailer_xcoin_purchase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {transaction.type === 'retailer_xcoin_purchase' ? '+' : '-'}{Math.abs(transaction.amount).toLocaleString()} XCoins
                                            </span>
                                        </div>
                                        {transaction.totalCost && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Total Cost:</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">${transaction.totalCost.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                                            <span className="text-sm text-gray-900 dark:text-white">{new Date(transaction.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Updated:</span>
                                            <span className="text-sm text-gray-900 dark:text-white">{new Date(transaction.updatedAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* User Information */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">User Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{transaction.userName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                                            <span className="text-sm text-gray-900 dark:text-white">{transaction.userEmail}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Role:</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {transaction.userRole.charAt(0).toUpperCase() + transaction.userRole.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                {(transaction.paymentMethod || transaction.paymentReference) && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Payment Information</h4>
                                        <div className="space-y-3">
                                            {transaction.paymentMethod && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Method:</span>
                                                    <span className="text-sm text-gray-900 dark:text-white">{transaction.paymentMethod}</span>
                                                </div>
                                            )}
                                            {transaction.paymentReference && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Reference:</span>
                                                    <span className="text-sm text-gray-900 dark:text-white">{transaction.paymentReference}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Notes and Actions */}
                            <div className="space-y-6">
                                {/* Payment Proof */}
                                {transaction.paymentProof && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Payment Proof</h4>
                                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                                            <img
                                                src={transaction.paymentProof}
                                                alt="Payment Proof"
                                                className="w-full h-48 object-cover rounded"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.nextElementSibling!.classList.remove('hidden');
                                                }}
                                            />
                                            <div className="hidden text-center text-gray-500 dark:text-gray-400 py-8">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="mt-2 text-sm">Unable to load image</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Notes</h4>
                                    {transaction.notes && (
                                        <div className="mb-3">
                                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">User Notes:</label>
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm text-gray-900 dark:text-white">
                                                {transaction.notes}
                                            </div>
                                        </div>
                                    )}
                                    {transaction.adminNotes && (
                                        <div className="mb-3">
                                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Admin Notes:</label>
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-gray-900 dark:text-white">
                                                {transaction.adminNotes}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Orders Information */}
                                {transaction.orders && transaction.orders.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Related Orders</h4>
                                        <div className="space-y-2">
                                            {transaction.orders.map((order: any, index: number) => (
                                                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        Order #{order.id?.slice(0, 8)}...
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Status: {order.status} | Game User: {order.gameUserId}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Status Update Actions */}
                                {transaction.status === 'pending' && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Update Status</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                                    Admin Notes (optional):
                                                </label>
                                                <textarea
                                                    value={adminNotes}
                                                    onChange={(e) => setAdminNotes(e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                    placeholder="Add notes about this status change..."
                                                />
                                            </div>
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleStatusUpdate('completed')}
                                                    disabled={updating}
                                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {updating ? 'Updating...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate('rejected')}
                                                    disabled={updating}
                                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {updating ? 'Updating...' : 'Reject'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;

