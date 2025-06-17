// Package type definition
export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  type: string;
  gameId: string;
  featured: boolean;
  discount: number;
  amount: number;
  duration: number;
  region: string;
  gameName: string;
  vendor: string;
  vendorPackageCode: string;
  vendorPackageCodes: string[];
  vendorPrice: number;
  baseVendorCost: number;
  currency: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  stock: number;
  resellKeyword: string;
  isPriceLocked: boolean;
  createdAt: string;
  updatedAt: string;
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