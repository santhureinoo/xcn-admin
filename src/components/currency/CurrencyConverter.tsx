import React, { useState, useEffect } from 'react';
import { Currency, CurrencyConversion } from '../../types/currency';
import currencyService, { SUPPORTED_CURRENCIES, X_COIN } from '../../services/currencyService';
import LoadingSpinner from '../ui/LoadingSpinner';

interface CurrencyConverterProps {
  onConversionCalculated?: (conversion: CurrencyConversion) => void;
  defaultAmount?: number;
  defaultCurrency?: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  onConversionCalculated,
  defaultAmount = 10,
  defaultCurrency = 'MYR'
}) => {
  const [fromAmount, setFromAmount] = useState<string>(defaultAmount.toString());
  const [fromCurrency, setFromCurrency] = useState<string>(defaultCurrency);
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate conversion when amount or currency changes
  useEffect(() => {
    const calculateConversion = async () => {
      const amount = parseFloat(fromAmount);
      if (!amount || amount <= 0) {
        setConversion(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await currencyService.calculateConversion(amount, fromCurrency);
        setConversion(result);
        onConversionCalculated?.(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
        setConversion(null);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(calculateConversion, 500);
    return () => clearTimeout(debounceTimer);
  }, [fromAmount, fromCurrency, onConversionCalculated]);

  const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === fromCurrency);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Currency Converter
      </h3>

      <div className="space-y-4">
        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="w-32">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {SUPPORTED_CURRENCIES.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Conversion Arrow */}
        <div className="flex justify-center">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* To Currency (X Coin) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="small" />
                    <span>Calculating...</span>
                  </div>
                ) : conversion ? (
                  `${conversion.toAmount.toLocaleString()} XCN`
                ) : (
                  '0 XCN'
                )}
              </div>
            </div>
            <div className="w-32">
              <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center">
                <span className="mr-2">{X_COIN.flag}</span>
                <span>{X_COIN.code}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Details */}
        {conversion && !loading && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Exchange Rate:</span>
              <span className="text-gray-900 dark:text-white">
                1 {selectedCurrency?.symbol} = {conversion.rate} XCN
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Processing Fee:</span>
              <span className="text-gray-900 dark:text-white">
                {selectedCurrency?.symbol}{conversion.fees.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Estimated Time:</span>
              <span className="text-gray-900 dark:text-white">{conversion.estimatedTime}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-white">Total Cost:</span>
                <span className="text-gray-900 dark:text-white">
                  {selectedCurrency?.symbol}{conversion.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;