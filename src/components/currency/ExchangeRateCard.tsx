import React from 'react';
import { ExchangeRate, Currency } from '../../types/currency';

interface ExchangeRateCardProps {
  rate: ExchangeRate;
  currency: Currency;
  onClick?: () => void;
}

const ExchangeRateCard: React.FC<ExchangeRateCardProps> = ({ rate, currency, onClick }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
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

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 ${
        onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{currency.flag}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{currency.code}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currency.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <span className="text-lg">{getTrendIcon(rate.trend)}</span>
            <span className={`text-sm font-medium ${getTrendColor(rate.trend)}`}>
              {formatChange(rate.change24h)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Rate:</span>
          <span className="font-bold text-gray-900 dark:text-white">
            1 {currency.symbol} = {rate.rate} XCN
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Last updated:</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(rate.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateCard;