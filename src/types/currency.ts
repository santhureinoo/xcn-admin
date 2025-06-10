export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  change24h: number; // percentage change in 24 hours
}

export interface CurrencyConversion {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  fees: number;
  totalCost: number;
  estimatedTime: string;
}

export interface XCoinTransaction {
  id: string;
  type: 'purchase' | 'spend' | 'refund';
  amount: number;
  fromCurrency?: string;
  fromAmount?: number;
  rate?: number;
  fees: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  description: string;
}

export interface UserWallet {
  userId: string;
  xCoinBalance: number;
  pendingBalance: number;
  totalSpent: number;
  totalPurchased: number;
  lastUpdated: string;
}