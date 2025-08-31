// Package type definition - Updated to match Prisma schema
export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;                    // Platform price in xCoin (final calculated price)
  basePrice?: number;               // Base price before markup (calculated in frontend)
  imageUrl: string;
  type: string;
  gameId: string;
  featured: boolean;
  discount: number;                 // DEPRECATED: Keep for backward compatibility
  amount: number;                   // Diamond/currency amount
  duration: number;                 // For subscription packages
  packageStatus: number;            // 1: Active, 2: Disabled, 3: Deleted

  // Enhanced pricing fields
  baseVendorCost: number;           // Cost in vendor coins (e.g., 1 SMILE_COIN)
  vendorCurrency: string;           // "SMILE_COIN", "RAZOR_GOLD_COIN"
  markupPercent: number;            // Platform markup %

  // Price locking
  lockedPrice?: number;             // Locked xCoin price (calculated)
  lastPriceUpdate?: string;         // When price was last calculated
  priceVersion: number;             // Version for price changes
  isPriceLocked: boolean;           // Flag to prevent auto price updates
  
  // Rounding preferences
  roundToNearest: number;           // Round to nearest 1, 5, 10, etc.

  // Markup relation fields
  markupId?: string;                // Foreign key to Markup table
  markupAppliedAt?: string;         // When markup was applied
  appliedMarkup?: {                 // Markup relation data
    id: string;
    name: string;
    description?: string;
    percentageAdd?: number;
    flatAmountAdd?: number;
    isActive: boolean;
  };

  // Admin management fields
  region: string;
  gameName: string;
  vendor: string;
  vendorPackageCode: string;
  vendorPackageCodes: string[];     // Frontend convenience field (split from vendorPackageCode)
  vendorPrice: number;              // Original vendor price
  currency: string;                 // R$, USD, etc
  resellKeyword: string;
  status: 'active' | 'inactive' | 'out_of_stock'; // Frontend enum mapping
  stock: number;
  
  createdAt: string;
  updatedAt: string;
}

// Markup type definition - Based on Prisma schema
export interface Markup {
  id: string;
  name: string;                     // "Service Fee", "Platform Fee", "Regional Tax", etc.
  description?: string;             // Optional description
  
  // Either percentage OR flat amount markup, not both
  percentageAdd?: number;           // e.g., 10.0 for 10% markup (500 -> 550)
  flatAmountAdd?: number;           // e.g., 50.0 for 50 xCoins markup (500 -> 550)
  
  // Markup settings
  isActive: boolean;
  startDate?: string;               // When markup starts (optional)
  endDate?: string;                 // When markup ends (optional)
  
  // Admin tracking
  createdBy?: string;               // Admin user ID who created
  updatedBy?: string;               // Admin user ID who last updated
  
  createdAt: string;
  updatedAt: string;
  
  // Computed fields for frontend
  markupType: 'percentage' | 'flat'; // Computed based on which field is set
  isExpired?: boolean;              // Computed based on endDate
  packageCount?: number;            // Count of packages using this markup
}

// Markup option for dropdowns/selectors
export interface MarkupOption {
  id: string;
  name: string;
  markupType: 'percentage' | 'flat';
  displayValue: string;             // "15%" or "+50 xCoins"
  percentageAdd?: number;
  flatAmountAdd?: number;
  isActive: boolean;
  isExpired?: boolean;
}

// Price calculation utility interface
export interface PriceCalculation {
  basePrice: number;
  markupAmount: number;
  finalPrice: number;
  markupType: 'percentage' | 'flat';
  markupValue: number;
  markupName?: string;
}

export interface VendorPackage {
  code: string;
  name: string;
  price: number;
  currency: string;
  diamonds?: number;
  description?: string;
}

export interface Vendor {
  id: string;
  name: string;
  region: string;
  gameName: string;
  packages: VendorPackage[];
}

export interface PackageFilters {
  region: string;
  gameName: string;
  vendor: string;
  status?: string;//'active' | 'inactive' | 'out_of_stock' | 'all';
  search?: string;
  sortBy?: string;//'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: string;//'asc' | 'desc';
  // Markup filters
  markupId?: string;
  hasMarkup?: boolean;
}

// Markup filters interface
export interface MarkupFilters {
  isActive?: boolean;
  search?: string;
  markupType?: 'percentage' | 'flat' | 'all';
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}