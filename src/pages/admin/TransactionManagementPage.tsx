import React, { useState, useEffect } from 'react';
import transactionService, { TransactionFilters, TransactionStats, Transaction } from '../../services/transactionService';
import TransactionStatsCards from '../../components/admin/transactions/TransactionStatsCards';
import TransactionFiltersComponent from '../../components/admin/transactions/TransactionFilters';
import TransactionTable from '../../components/admin/transactions/TransactionTable';
import TransactionDetailModal from '../../components/admin/transactions/TransactionDetailModal';

const TransactionManagementPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState<TransactionStats>({
        totalTransactions: 0,
        totalXCoinPurchased: 0,
        totalXCoinSpent: 0,
        totalRevenue: 0,
        pendingRequests: 0,
        completedToday: 0
    });
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const pageSize = 50;

    // Modal states
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState<TransactionFilters>({
        type: 'all',
        status: 'all',
        userRole: 'all',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    // Load transactions from API
    const loadTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await transactionService.getTransactions(filters, currentPage, pageSize);
            if (response.success) {
                setTransactions(response.transactions);
                setFilteredTransactions(response.transactions);
                setTotalPages(response.pagination.totalPages);
                setTotalTransactions(response.pagination.total);
            } else {
                setError('Failed to load transactions');
                setTransactions([]);
                setFilteredTransactions([]);
            }
        } catch (error: any) {
            console.error('Failed to load transactions:', error);
            setError(error.message || 'Failed to load transactions');
            setTransactions([]);
            setFilteredTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Load stats from API
    const loadStats = async () => {
        setStatsLoading(true);
        try {
            const response = await transactionService.getTransactionStats();
            if (response.success) {
                setStats(response.stats);
            } else {
                console.error('Failed to load stats');
            }
        } catch (error: any) {
            console.error('Failed to load stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    // Load data on component mount and when filters/page change
    useEffect(() => {
        loadTransactions();
    }, [filters, currentPage]);

    // Load stats on component mount
    useEffect(() => {
        loadStats();
    }, []);

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<TransactionFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleClearFilters = () => {
        setFilters({
            type: 'all',
            status: 'all',
            userRole: 'all',
            search: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setCurrentPage(1);
    };

    // Handle transaction actions
    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailModal(true);
    };

    const handleUpdateTransactionStatus = async (transactionId: string, status: string, adminNotes?: string) => {
        try {
            const response = await transactionService.updateTransactionStatus(transactionId, status, adminNotes);
            
            if (response.success) {
                // Update the transaction in the list
                const updatedTransactions = transactions.map(t =>
                    t.id === transactionId ? response.transaction : t
                );
                setTransactions(updatedTransactions);
                setFilteredTransactions(updatedTransactions);

                // Update selected transaction if it's the same one
                if (selectedTransaction?.id === transactionId) {
                    setSelectedTransaction(response.transaction);
                }

                // Reload stats to reflect changes
                await loadStats();

                alert(response.message);
            } else {
                alert('Failed to update transaction status');
            }
        } catch (error: any) {
            console.error('Failed to update transaction status:', error);
            alert(error.message || 'Failed to update transaction status');
        }
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Transaction Management
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Monitor and manage all platform transactions
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button 
                                onClick={loadTransactions}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Stats Cards */}
                <TransactionStatsCards stats={stats} loading={statsLoading} />

                {/* Filters */}
                <div className="mb-6">
                    <TransactionFiltersComponent
                        filters={filters}
                        onFiltersChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Error loading transactions
                                </h3>
                                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                    <p>{error}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={loadTransactions}
                                        className="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions Table */}
                <TransactionTable
                    transactions={filteredTransactions}
                    loading={loading}
                    onTransactionClick={handleTransactionClick}
                    onUpdateStatus={handleUpdateTransactionStatus}
                />

                {/* No transactions found */}
                {!loading && filteredTransactions.length === 0 && transactions.length > 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No transactions found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Try adjusting your search or filter criteria.
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* No transactions at all */}
                {!loading && transactions.length === 0 && !error && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No transactions yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Transactions will appear here once users start making purchases.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing{' '}
                                    <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                                    {' '}to{' '}
                                    <span className="font-medium">
                                        {Math.min(currentPage * pageSize, totalTransactions)}
                                    </span>
                                    {' '}of{' '}
                                    <span className="font-medium">{totalTransactions}</span>
                                    {' '}results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* Page numbers */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Transaction Detail Modal */}
            <TransactionDetailModal
                transaction={selectedTransaction}
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedTransaction(null);
                }}
                onUpdateStatus={handleUpdateTransactionStatus}
            />
        </div>
    );
};

export default TransactionManagementPage;