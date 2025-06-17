import React, { useState, useEffect } from 'react';
import currencyService, { VendorExchangeRate } from '../../../services/currencyService';

const VendorRatesManagement: React.FC = () => {
  const [vendorRates, setVendorRates] = useState<VendorExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingRate, setEditingRate] = useState<{ id: string; rate: number } | null>(null);

  useEffect(() => {
    loadVendorRates();
  }, []);

  const loadVendorRates = async () => {
    try {
      setLoading(true);
      const response = await currencyService.getVendorRates();
      setVendorRates(response.rates);
    } catch (error) {
      console.error('Failed to load vendor rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRate = async (vendorName: string, vendorCurrency: string, newRate: number, reason?: string) => {
    try {
      setUpdating(`${vendorName}-${vendorCurrency}`);
      await currencyService.updateVendorRate(vendorName, vendorCurrency, newRate, 'admin', reason);
      await loadVendorRates(); // Reload to get updated data
      setEditingRate(null);
    } catch (error) {
      console.error('Failed to update vendor rate:', error);
      alert('Failed to update vendor rate');
    } finally {
      setUpdating(null);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP':
        return <span className="text-green-500">↗</span>;
      case 'DOWN':
        return <span className="text-red-500">↘</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'UP':
        return 'text-green-600 bg-green-50';
      case 'DOWN':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Vendor Exchange Rates
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage xCoin to vendor currency exchange rates
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {vendorRates.map((rate) => (
            <div
              key={rate.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {rate.vendorName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {rate.vendorCurrency}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(rate.trend)}`}>
                      {getTrendIcon(rate.trend)} {rate.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    {editingRate?.id === rate.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editingRate.rate}
                          onChange={(e) => setEditingRate({ ...editingRate, rate: parseFloat(e.target.value) || 0 })}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          step="0.01"
                          min="0"
                        />
                        <button
                          onClick={() => handleUpdateRate(rate.vendorName, rate.vendorCurrency, editingRate.rate)}
                          disabled={updating === `${rate.vendorName}-${rate.vendorCurrency}`}
                          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {updating === `${rate.vendorName}-${rate.vendorCurrency}` ? '...' : '✓'}
                        </button>
                        <button
                          onClick={() => setEditingRate(null)}
                          className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {rate.xCoinRate} xCoin
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          = 1 {rate.vendorCurrency}
                        </div>
                      </>
                    )}
                  </div>

                  {editingRate?.id !== rate.id && (
                    <button
                      onClick={() => setEditingRate({ id: rate.id, rate: rate.xCoinRate })}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {rate.previousRate && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Previous: {rate.previousRate} xCoin
                  {rate.updateReason && ` • ${rate.updateReason}`}
                </div>
              )}
            </div>
          ))}
        </div>

        {vendorRates.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              No vendor exchange rates configured
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorRatesManagement;