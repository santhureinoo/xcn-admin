// Package type definition
export interface Package {
  id: string;
  name: string;
  description: string;
  resellKeyword: string;
  price: number;
  imageUrl: string;
  type: 'diamond' | 'weekly' | 'monthly' | 'special' | 'subscription';
  gameId: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  discount?: number;
  amount?: number;
  duration?: number;
  
  // New fields for admin management
  region: string; // Myanmar, Malaysia, etc
  gameName: string; // Mobile Legends, Free Fire, etc
  vendor: string; // Smile, Razor Gold, etc
  vendorPackageCode: string; // svp, wkp, 55, etc
  vendorPrice: number; // Original vendor price
  currency: string; // R$, USD, etc
  status: 'active' | 'inactive' | 'out_of_stock';
  stock?: number;
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
  region?: string;
  gameName?: string;
  vendor?: string;
  status?: 'active' | 'inactive' | 'out_of_stock' | 'all';
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}