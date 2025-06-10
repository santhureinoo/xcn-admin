export type TransactionType = 
  | 'retailer_xcoin_purchase'    // Retailer buying xCoin from platform
  | 'retailer_package_purchase'  // Retailer buying packages with xCoin
  | 'reseller_xcoin_request'     // Reseller requesting xCoin fill from admin
  | 'reseller_bulk_purchase'     // Reseller buying multiple packages
  | 'vendor_exchange'            // xCoin to vendor coin exchange record

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing';

export interface BaseTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: 'retailer' | 'reseller';
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  adminNotes?: string;
}

// 1. Retailer buying xCoin from platform
export interface RetailerXCoinPurchase extends BaseTransaction {
  type: 'retailer_xcoin_purchase';
  fromCurrency: string;
  fromAmount: number;
  exchangeRate: number;
  xCoinAmount: number;
  processingFee: number;
  totalCost: number;
  paymentMethod: string;
  paymentReference?: string;
}

// 2. Retailer buying packages from platform by xCoin
export interface RetailerPackagePurchase extends BaseTransaction {
  type: 'retailer_package_purchase';
  packageId: string;
  packageName: string;
  packageType: string;
  xCoinCost: number;
  quantity: number;
  totalXCoinCost: number;
  gameInfo: {
    userId: string;
    serverId: string;
    playerName?: string;
    region: string;
  };
}

// 3. Reseller asking admin to fill out xCoin from platform
export interface ResellerXCoinRequest extends BaseTransaction {
  type: 'reseller_xcoin_request';
  requestedXCoinAmount: number;
  approvedXCoinAmount?: number;
  fromCurrency: string;
  fromAmount: number;
  exchangeRate?: number;
  paymentMethod: string;
  paymentProof?: string;
  externalPaymentReference: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

// 4. Reseller buying multiple packages by prompt from platform
export interface ResellerBulkPurchase extends BaseTransaction {
  type: 'reseller_bulk_purchase';
  packages: Array<{
    packageId: string;
    packageName: string;
    packageType: string;
    xCoinCost: number;
    quantity: number;
    gameInfo: {
      userId: string;
      serverId: string;
      playerName?: string;
      region: string;
    };
  }>;
  totalXCoinCost: number;
  totalPackages: number;
  bulkDiscount?: number;
  finalXCoinCost: number;
}

// 5. Actual records of using xCoin and vendor coin exchange
export interface VendorExchange extends BaseTransaction {
  type: 'vendor_exchange';
  vendorName: string;
  vendorCurrency: string;
  xCoinAmount: number;
  vendorCoinAmount: number;
  exchangeRate: number;
  packageId: string;
  packageName: string;
  relatedTransactionId: string; // Links to the original purchase transaction
  vendorTransactionId?: string;
  vendorResponse?: any;
}

export type Transaction = 
  | RetailerXCoinPurchase 
  | RetailerPackagePurchase 
  | ResellerXCoinRequest 
  | ResellerBulkPurchase 
  | VendorExchange;

export interface TransactionFilters {
  type?: TransactionType | 'all';
  status?: TransactionStatus | 'all';
  userRole?: 'retailer' | 'reseller' | 'all';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: 'createdAt' | 'amount' | 'status' | 'userName';
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionStats {
  totalTransactions: number;
  totalXCoinPurchased: number;
  totalXCoinSpent: number;
  totalRevenue: number;
  pendingRequests: number;
  completedToday: number;
}