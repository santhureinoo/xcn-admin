import { Transaction, RetailerXCoinPurchase, RetailerPackagePurchase, ResellerXCoinRequest, ResellerBulkPurchase, VendorExchange } from '../types/transaction';

// Mock Retailer XCoin Purchases
const mockRetailerXCoinPurchases: RetailerXCoinPurchase[] = [
  {
    id: 'txn_001',
    userId: 'user_001',
    userEmail: 'john.retailer@example.com',
    userName: 'John Smith',
    userRole: 'retailer',
    type: 'retailer_xcoin_purchase',
    status: 'completed',
    fromCurrency: 'USD',
    fromAmount: 100,
    exchangeRate: 1000,
    xCoinAmount: 100000,
    processingFee: 2.5,
    totalCost: 102.5,
    paymentMethod: 'Credit Card',
    paymentReference: 'cc_1234567890',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:35:00Z',
    notes: 'First time purchase'
  },
  {
    id: 'txn_002',
    userId: 'user_002',
    userEmail: 'sarah.retailer@example.com',
    userName: 'Sarah Johnson',
    userRole: 'retailer',
    type: 'retailer_xcoin_purchase',
    status: 'pending',
    fromCurrency: 'EUR',
    fromAmount: 50,
    exchangeRate: 1100,
    xCoinAmount: 55000,
    processingFee: 1.5,
    totalCost: 51.5,
    paymentMethod: 'Bank Transfer',
    paymentReference: 'bt_9876543210',
    createdAt: '2024-01-21T14:15:00Z',
    updatedAt: '2024-01-21T14:15:00Z',
    adminNotes: 'Waiting for bank confirmation'
  },
  {
    id: 'txn_003',
    userId: 'user_003',
    userEmail: 'mike.retailer@example.com',
    userName: 'Mike Wilson',
    userRole: 'retailer',
    type: 'retailer_xcoin_purchase',
    status: 'failed',
    fromCurrency: 'USD',
    fromAmount: 200,
    exchangeRate: 1000,
    xCoinAmount: 200000,
    processingFee: 5,
    totalCost: 205,
    paymentMethod: 'PayPal',
    paymentReference: 'pp_5555666677',
    createdAt: '2024-01-19T09:20:00Z',
    updatedAt: '2024-01-19T09:25:00Z',
    notes: 'Urgent purchase needed',
    adminNotes: 'Payment declined by PayPal'
  }
];

// Mock Retailer Package Purchases
const mockRetailerPackagePurchases: RetailerPackagePurchase[] = [
  {
    id: 'txn_004',
    userId: 'user_001',
    userEmail: 'john.retailer@example.com',
    userName: 'John Smith',
    userRole: 'retailer',
    type: 'retailer_package_purchase',
    status: 'completed',
    packageId: 'pkg_ml_diamonds_100',
    packageName: 'Mobile Legends 100 Diamonds',
    packageType: 'diamond',
    xCoinCost: 5000,
    quantity: 2,
    totalXCoinCost: 10000,
    gameInfo: {
      userId: '123456789',
      serverId: '2001',
      playerName: 'JohnGamer',
      region: 'Southeast Asia'
    },
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:05:00Z',
    notes: 'For my main account'
  },
  {
    id: 'txn_005',
    userId: 'user_004',
    userEmail: 'lisa.retailer@example.com',
    userName: 'Lisa Chen',
    userRole: 'retailer',
    type: 'retailer_package_purchase',
    status: 'processing',
    packageId: 'pkg_ml_weekly_pass',
    packageName: 'Mobile Legends Weekly Pass',
    packageType: 'weekly',
    xCoinCost: 15000,
    quantity: 1,
    totalXCoinCost: 15000,
    gameInfo: {
      userId: '987654321',
      serverId: '2003',
      playerName: 'LisaML',
      region: 'Southeast Asia'
    },
    createdAt: '2024-01-21T16:30:00Z',
    updatedAt: '2024-01-21T16:30:00Z'
  }
];

// Mock Reseller XCoin Requests
const mockResellerXCoinRequests: ResellerXCoinRequest[] = [
  {
    id: 'txn_006',
    userId: 'user_005',
    userEmail: 'alex.reseller@example.com',
    userName: 'Alex Rodriguez',
    userRole: 'reseller',
    type: 'reseller_xcoin_request',
    status: 'pending',
    requestedXCoinAmount: 500000,
    fromCurrency: 'USD',
    fromAmount: 450,
    paymentMethod: 'Bank Transfer',
    externalPaymentReference: 'WIRE_20240121_001',
    createdAt: '2024-01-21T08:00:00Z',
    updatedAt: '2024-01-21T08:00:00Z',
    notes: 'Bulk purchase for my customers',
    adminNotes: 'Checking payment proof'
  },
  {
    id: 'txn_007',
    userId: 'user_006',
    userEmail: 'maria.reseller@example.com',
    userName: 'Maria Garcia',
    userRole: 'reseller',
    type: 'reseller_xcoin_request',
    status: 'completed',
    requestedXCoinAmount: 1000000,
    approvedXCoinAmount: 1000000,
    fromCurrency: 'USD',
    fromAmount: 900,
    exchangeRate: 1111,
    paymentMethod: 'Crypto',
    externalPaymentReference: 'BTC_TX_ABC123DEF456',
    approvedBy: 'admin@example.com',
    approvedAt: '2024-01-20T15:30:00Z',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    notes: 'Monthly stock replenishment'
  },
  {
    id: 'txn_008',
    userId: 'user_007',
    userEmail: 'david.reseller@example.com',
    userName: 'David Kim',
    userRole: 'reseller',
    type: 'reseller_xcoin_request',
    status: 'failed',
    requestedXCoinAmount: 250000,
    fromCurrency: 'USD',
    fromAmount: 225,
    paymentMethod: 'Bank Transfer',
    externalPaymentReference: 'WIRE_20240119_005',
    rejectionReason: 'Payment not received within 24 hours',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    adminNotes: 'Customer needs to resubmit with valid payment proof'
  }
];

// Mock Reseller Bulk Purchases
const mockResellerBulkPurchases: ResellerBulkPurchase[] = [
  {
    id: 'txn_009',
    userId: 'user_005',
    userEmail: 'alex.reseller@example.com',
    userName: 'Alex Rodriguez',
    userRole: 'reseller',
    type: 'reseller_bulk_purchase',
    status: 'completed',
    packages: [
      {
        packageId: 'pkg_ml_diamonds_100',
        packageName: 'Mobile Legends 100 Diamonds',
        packageType: 'diamond',
        xCoinCost: 5000,
        quantity: 10,
        gameInfo: {
          userId: '111222333',
          serverId: '2001',
          playerName: 'Customer1',
          region: 'Southeast Asia'
        }
      },
      {
        packageId: 'pkg_ml_diamonds_500',
        packageName: 'Mobile Legends 500 Diamonds',
        packageType: 'diamond',
        xCoinCost: 20000,
        quantity: 5,
        gameInfo: {
          userId: '444555666',
          serverId: '2002',
          playerName: 'Customer2',
          region: 'Southeast Asia'
        }
      }
    ],
    totalXCoinCost: 150000,
    totalPackages: 15,
    bulkDiscount: 5,
    finalXCoinCost: 142500,
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
    notes: 'Bulk order for weekend promotion'
  }
];

// Mock Vendor Exchanges
const mockVendorExchanges: VendorExchange[] = [
  {
    id: 'txn_010',
    userId: 'system',
    userEmail: 'system@platform.com',
    userName: 'System',
    userRole: 'retailer',
    type: 'vendor_exchange',
    status: 'completed',
    vendorName: 'Moonton Official',
    vendorCurrency: 'Diamonds',
    xCoinAmount: 5000,
    vendorCoinAmount: 100,
    exchangeRate: 50,
    packageId: 'pkg_ml_diamonds_100',
    packageName: 'Mobile Legends 100 Diamonds',
    relatedTransactionId: 'txn_004',
    vendorTransactionId: 'moonton_tx_789012',
    vendorResponse: {
      status: 'success',
      message: 'Diamonds delivered successfully',
      deliveryTime: '2024-01-20T11:03:00Z'
    },
    createdAt: '2024-01-20T11:02:00Z',
    updatedAt: '2024-01-20T11:03:00Z'
  },
  {
    id: 'txn_011',
    userId: 'system',
    userEmail: 'system@platform.com',
    userName: 'System',
    userRole: 'retailer',
    type: 'vendor_exchange',
    status: 'failed',
    vendorName: 'Moonton Official',
    vendorCurrency: 'Diamonds',
    xCoinAmount: 15000,
    vendorCoinAmount: 300,
    exchangeRate: 50,
    packageId: 'pkg_ml_diamonds_300',
    packageName: 'Mobile Legends 300 Diamonds',
    relatedTransactionId: 'txn_012',
    vendorResponse: {
      status: 'error',
      message: 'Invalid user ID provided',
      errorCode: 'INVALID_USER_ID'
    },
    createdAt: '2024-01-21T14:00:00Z',
    updatedAt: '2024-01-21T14:01:00Z',
    adminNotes: 'Need to refund customer and verify user ID format'
  }
];

// Combine all transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  ...mockRetailerXCoinPurchases,
  ...mockRetailerPackagePurchases,
  ...mockResellerXCoinRequests,
  ...mockResellerBulkPurchases,
  ...mockVendorExchanges
];

// Export individual arrays for specific use cases
export {
  mockRetailerXCoinPurchases,
  mockRetailerPackagePurchases,
  mockResellerXCoinRequests,
  mockResellerBulkPurchases,
  mockVendorExchanges
};