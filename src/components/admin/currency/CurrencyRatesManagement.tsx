import React, { useState, useEffect } from 'react';
import currencyService from '../../../services/currencyService';
import { ExchangeRate } from '../../../types/currency';

const CurrencyRatesManagement: React.FC = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Load exchange rates from backend
  const loadRates = async () => {
    setLoading(true);
    try {
      const response = await currencyService.getExchangeRates();
      if (response.success) {
        setRates(response.rates);
      } else {
        console.error('Failed to load rates');
      }
    } catch (error: any) {
      console.error('Failed to load rates:', error);
      alert(error.message || 'Failed to load exchange rates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleEditRate = (currencyCode: string, currentRate: number) => {
    setEditingRate(currencyCode);
    setEditValue(currentRate.toString());
  };

  const handleSaveRate = async (currencyCode: string) => {
    const newRate = parseFloat(editValue);
    if (isNaN(newRate) || newRate <= 0) {
      alert('Please enter a valid rate');
      return;
    }

    try {
      const response = await currencyService.updateExchangeRate(currencyCode, 'XCN', newRate);
      
      if (response.success) {
        // Update the local state with the response data
        setRates(prev => prev.map(rate => 
          rate.fromCurrency === currencyCode 
            ? { 
                ...rate, 
                rate: response.rate.rate, 
                lastUpdated: response.rate.lastUpdated,
                trend: response.rate.trend,
                change24h: response.rate.change24h
              }
            : rate
        ));
        setEditingRate(null);
        alert(response.message || 'Rate updated successfully');
      } else {
        alert('Failed to update rate');
      }
    } catch (error: any) {
      console.error('Failed to update rate:', error);
      alert(error.message || 'Failed to update rate');
    }
  };

  const handleCancelEdit = () => {
    setEditingRate(null);
    setEditValue('');
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↗</span>;
      case 'down':
        return <span className="text-red-500">↘</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Exchange Rates Management
        </h3>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Exchange Rates Management
          </h3>
          <button
            onClick={loadRates}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage exchange rates for different currencies to X Coins
        </p>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rate (to XCN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  24h Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {rates.map((rate) => (
                <tr key={`${rate.fromCurrency}-${rate.toCurrency}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {rate.fromCurrency}
                      </div>
                      {rate.fromCurrency && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({rate.fromCurrency})
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRate === rate.fromCurrency ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          step="0.01"
                          className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleSaveRate(rate.fromCurrency)}
                          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {rate.rate.toFixed(4)}
                        </span>
                        <span className="ml-2">{getTrendIcon(rate.trend)}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getTrendColor(rate.trend)}`}>
                      {rate.change24h > 0 ? '+' : ''}{rate.change24h.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(rate.lastUpdated).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingRate === rate.fromCurrency ? null : (
                      <button
                        onClick={() => handleEditRate(rate.fromCurrency, rate.rate)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No exchange rates found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyRatesManagement;