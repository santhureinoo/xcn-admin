import React, { useState, useEffect } from 'react';
import CurrencyStatsCards from '../../components/admin/currency/CurrencyStatsCards';
import CurrencyRatesManagement from '../../components/admin/currency/CurrencyRatesManagement';
import currencyService from '../../services/currencyService';

interface CurrencyStats {
  totalXCoinsInCirculation: number;
  totalXCoinsPurchased24h: number;
  totalXCoinsSpent24h: number;
  totalRevenue24h: number;
  averageExchangeRate: number;
  activeUsers24h: number;
}

const MOCK_CURRENCY_STATS: CurrencyStats = {
  totalXCoinsInCirculation: 2500000,
  totalXCoinsPurchased24h: 45000,
  totalXCoinsSpent24h: 38000,
  totalRevenue24h: 12500,
  averageExchangeRate: 95.5,
  activeUsers24h: 1250
};

const CurrencyManagementPage: React.FC = () => {
  const [stats, setStats] = useState<CurrencyStats>(MOCK_CURRENCY_STATS);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const response = await currencyService.getCurrencyStats();
        setStats(response.stats);
      } catch (error: any) {
        console.error('Failed to load currency stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Currency Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage X Coin exchange rates and monitor currency statistics
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Export Report
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <CurrencyStatsCards stats={stats} loading={statsLoading} />

        {/* Exchange Rates Management */}
        <CurrencyRatesManagement />

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Currency System Information
              </h4>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p>• Exchange rates are updated automatically every 5 minutes</p>
                <p>• Manual rate adjustments take effect immediately</p>
                <p>• All transactions are processed in X Coins (XCN)</p>
                <p>• Processing fees vary by currency and are automatically calculated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyManagementPage;