import axiosInstance from './axiosConfig';
import { Currency, ExchangeRate, CurrencyConversion, XCoinTransaction, UserWallet } from '../types/currency';

export interface CurrencyStats {
  totalXCoinsInCirculation: number;
  totalXCoinsPurchased24h: number;
  totalXCoinsSpent24h: number;
  totalRevenue24h: number;
  averageExchangeRate: number;
  activeUsers24h: number;
}

// Supported currencies
export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
];

export const X_COIN: Currency = {
  code: 'XCN',
  name: 'X Coin',
  symbol: 'XCN',
  flag: '🪙'
};

class CurrencyService {
  private baseUrl = '/currency';

  // Get all supported currencies
  getSupportedCurrencies(): Currency[] {
    return SUPPORTED_CURRENCIES;
  }

  // Get current exchange rates
  async getExchangeRates(): Promise<{ success: boolean; rates: ExchangeRate[] }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/exchange-rates`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch exchange rates');
    }
  }

  // Get specific exchange rate
  async getExchangeRate(fromCurrency: string, toCurrency: string = 'XCN'): Promise<ExchangeRate | null> {
    const rates = await this.getExchangeRates();
    return rates.rates.find(rate => rate.fromCurrency === fromCurrency && rate.toCurrency === toCurrency) || null;
  }

  // Calculate conversion
  async calculateConversion(
    fromAmount: number, 
    fromCurrency: string, 
    toCurrency: string = 'XCN'
  ): Promise<CurrencyConversion> {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    
    if (!rate) {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }

    const toAmount = fromAmount * rate.rate;
    const fees = this.calculateFees(fromAmount, fromCurrency);
    const totalCost = fromAmount + fees;

    return {
      fromAmount,
      fromCurrency,
      toAmount: Math.floor(toAmount), // X Coins are whole numbers
      toCurrency,
      rate: rate.rate,
      fees,
      totalCost,
      estimatedTime: this.getEstimatedTime(fromCurrency)
    };
  }

  // Calculate fees based on currency and amount
  private calculateFees(amount: number, currency: string): number {
    const feePercentage = this.getFeePercentage(currency);
    const fee = amount * (feePercentage / 100);
    const minFee = this.getMinimumFee(currency);
    return Math.max(fee, minFee);
  }

  private getFeePercentage(currency: string): number {
    const feeMap: { [key: string]: number } = {
      'USD': 2.5,
      'MYR': 3.0,
      'SGD': 2.5,
      'THB': 3.5,
      'IDR': 4.0,
      'VND': 4.0,
      'PHP': 3.5,
    };
    return feeMap[currency] || 3.0;
  }

  private getMinimumFee(currency: string): number {
    const minFeeMap: { [key: string]: number } = {
      'USD': 0.5,
      'MYR': 2.0,
      'SGD': 1.0,
      'THB': 15.0,
      'IDR': 5000,
      'VND': 10000,
      'PHP': 25.0,
    };
    return minFeeMap[currency] || 1.0;
  }

  private getEstimatedTime(currency: string): string {
    const timeMap: { [key: string]: string } = {
      'USD': '1-2 hours',
      'MYR': 'Instant',
      'SGD': '30 minutes',
      'THB': 'Instant',
      'IDR': '2-4 hours',
      'VND': '1-3 hours',
      'PHP': '1-2 hours',
    };
    return timeMap[currency] || '1-2 hours';
  }

  // Purchase X Coins
  async purchaseXCoins(
    amount: number, 
    fromCurrency: string, 
    paymentMethod: string
  ): Promise<XCoinTransaction> {
    const conversion = await this.calculateConversion(amount, fromCurrency);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const transaction: XCoinTransaction = {
      id: `xcn_${Date.now()}`,
      type: 'purchase',
      amount: conversion.toAmount,
      fromCurrency: conversion.fromCurrency,
      fromAmount: conversion.fromAmount,
      rate: conversion.rate,
      fees: conversion.fees,
      status: 'pending',
      createdAt: new Date().toISOString(),
      description: `Purchase ${conversion.toAmount} X Coins with ${conversion.fromAmount} ${fromCurrency}`
    };

    return transaction;
  }

  // Get user wallet
  async getUserWallet(userId: string): Promise<UserWallet> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock wallet data
    return {
      userId,
      xCoinBalance: 1250,
      pendingBalance: 100,
      totalSpent: 850,
      totalPurchased: 2100,
      lastUpdated: new Date().toISOString()
    };
  }

  // Get transaction history
  async getTransactionHistory(userId: string): Promise<XCoinTransaction[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock transaction data
    return [
      {
        id: 'xcn_1',
        type: 'purchase',
        amount: 500,
        fromCurrency: 'MYR',
        fromAmount: 20,
        rate: 23.5,
        fees: 0.6,
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        description: 'Purchase 500 X Coins with 20 MYR'
      },
      {
        id: 'xcn_2',
        type: 'spend',
        amount: 150,
        fees: 0,
        status: 'completed',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        description: 'Mobile Legends Diamond Package'
      },
      {
        id: 'xcn_3',
        type: 'purchase',
        amount: 1000,
        fromCurrency: 'USD',
        fromAmount: 10,
        rate: 100,
        fees: 0.5,
        status: 'completed',
        createdAt: new Date(Date.now() - 21600000).toISOString(),
        description: 'Purchase 1000 X Coins with 10 USD'
      }
    ];
  }

  async getCurrencyStats(): Promise<{ success: boolean; stats: CurrencyStats }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch currency stats');
    }
  }

  async updateExchangeRate(fromCurrency: string, toCurrency: string, rate: number): Promise<{ success: boolean; rate: ExchangeRate; message: string }> {
    try {
      const response = await axiosInstance.patch(
        `${this.baseUrl}/exchange-rates/${fromCurrency}/${toCurrency}`,
        { rate }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update exchange rate');
    }
  }
}

export default new CurrencyService();