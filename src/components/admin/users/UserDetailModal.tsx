import React, { useState } from 'react';
import { User } from '../../../types/user';
import userService from '../../../services/userService';

interface UserDetailModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onToggleStatus: (user: User) => void;
    onUserUpdated?: (updatedUser: User) => void; // This prop is now being passed from parent
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
    user,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    onToggleStatus,
    onUserUpdated
}) => {
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [rechargeNotes, setRechargeNotes] = useState('');
    const [rechargeLoading, setRechargeLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(user);

    // Update currentUser when user prop changes
    React.useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    if (!isOpen || !currentUser) return null;

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'retailer':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'reseller':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'suspended':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const handleRechargeXCN = async () => {
        if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setRechargeLoading(true);
        try {
            const response = await userService.rechargeBalance(currentUser.id, {
                amount: parseFloat(rechargeAmount),
                notes: rechargeNotes.trim() || undefined
            });

            if (response.success) {
                // Update the current user's balance
                const updatedUser = {
       ...currentUser,
                    balance: response.user.balance
                };
                setCurrentUser(updatedUser);

                // Notify parent component about the update
                if (onUserUpdated) {
                    onUserUpdated(updatedUser);
                }

                // Show success message with transaction details
                alert(`${response.message}\n\nTransaction Details:\nPrevious Balance: ${response.transaction.previousBalance.toLocaleString()} XCN\nRecharge Amount: ${response.transaction.amount.toLocaleString()} XCN\nNew Balance: ${response.transaction.newBalance.toLocaleString()} XCN`);

                // Reset form
                setShowRechargeModal(false);
                setRechargeAmount('');
                setRechargeNotes('');
            }
        } catch (error: any) {
            console.error('Failed to recharge XCN:', error);
            alert(error.message || 'Failed to recharge XCN. Please try again.');
        } finally {
            setRechargeLoading(false);
        }
    };

    const handleCloseRechargeModal = () => {
        if (!rechargeLoading) {
            setShowRechargeModal(false);
            setRechargeAmount('');
            setRechargeNotes('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Recharge XCN Modal */}
            {showRechargeModal && (
                <div className="fixed inset-0 z-60 overflow-y-auto">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={() => setShowRechargeModal(false)}
                    ></div>

                    {/* Modal */}
                    <div className="relative min-h-screen flex items-center justify-center p-4">
                        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Recharge XCN
                                </h3>
                                <button
                                    onClick={() => setShowRechargeModal(false)}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-00"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Recharge XCN for: <span className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</span>
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Current Balance: <span className="font-medium text-gray-900 dark:text-white">${user.balance.toLocaleString()}</span>
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Recharge Amount (XCN)
                                    </label>
                                    <input
                                        type="number"
                                        value={rechargeAmount}
                                        onChange={(e) => setRechargeAmount(e.target.value)}
                                        placeholder="Enter amount to recharge"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowRechargeModal(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRechargeXCN}
                                        disabled={rechargeLoading || !rechargeAmount || parseFloat(rechargeAmount) <= 0}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {rechargeLoading ? 'Processing...' : 'Recharge XCN'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            User Details
                        </h2>
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
                        {/* User Avatar and Basic Info */}
                        <div className="flex flex-col lg:flex-row lg:items-center mb-8">
                            <div className="flex items-center mb-4 lg:mb-0">
                                <div className="flex-shrink-0 h-20 w-20">
                                    {user.avatar ? (
                                        <img className="h-20 w-20 rounded-full object-cover" src={user.avatar} alt="" />
                                    ) : (
                                        <div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                            <span className="text-xl font-medium text-gray-700 dark:text-gray-300">
                                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user.firstName} {user.lastName}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="lg:ml-auto flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setShowRechargeModal(true)}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Recharge XCN
                                </button>
                                <button
                                    onClick={() => onEdit(user)}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.556-8.586z" />
                                    </svg>
                                    Edit User
                                </button>
                                <button
                                    onClick={() => onToggleStatus(user)}
                                    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${user.status === 'active'
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                >
                                    {user.status === 'active' ? (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.864 5.636M5.636 18.364l12.728-12.728" />
                                            </svg>
                                            Suspend User
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 229 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Activate User
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => onDelete(user)}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-441 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete User
                                </button>
                            </div>
                        </div>

                        {/* User Information Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Personal Information */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Personal Information
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                                        <p className="text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                        <p className="text-gray-900 dark:text-white">{user.email}</p>
                                    </div>
                                    {user.phone && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                            <p className="text-gray-900 dark:text-white">{user.phone}</p>
                                        </div>
                                    )}
                                    {user.address && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                                            <p className="text-gray-900 dark:text-white">{user.address}</p>
                                        </div>
                                    ) }
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</label>
                                        <p className="text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {user.lastLoginAt && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</label>
                                            <p className="text-gray-900 dark:text-white">{new Date(user.lastLoginAt).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Statistics */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Account Statistics
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 1 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">${user.balance.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">${user.totalSpent.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{user.totalOrders}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reseller Information (if applicable) */}
                        {user.role === 'reseller' && (
                            <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Reseller Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {user.commission && (
                                        <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Commission Rate</p>
                                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user.commission}%</p>
                                        </div>
                                    )}
                                    {user.totalEarnings && (
                                        <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</p>
                                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">${user.totalEarnings.toLocaleString()}</p>
                                        </div>
                                    )}
                                    {user.referralCode && (
                                        <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Referral Code</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">{user.referralCode}</p>
                                        </div>
                                    )}
                                    {user.downlineCount && (
                                        <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Downline Count</p>
                                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user.downlineCount}</p>
                                        </div>
                                    )}
                                </div>
                                {user.referredBy && (
                                    <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Referred By</p>
                                        <p className="text-gray-900 dark:text-white">{user.referredBy}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Recent Activity
                            </h4>
                            <div className="space-y-3">
                                {/* Mock recent activities */}
                                <div className="flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Purchased Diamond Package</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                                    </div>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">+500 Diamonds</span>
                                </div>

                                <div className="flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Account Balance Top-up</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                                    </div>
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">+$50.00</span>
                                </div>

                                <div className="flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900/30 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Order #12345</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-400">+$250.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;