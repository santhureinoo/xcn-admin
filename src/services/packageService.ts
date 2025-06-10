import axiosInstance from './axiosConfig';
import { Package, PackageFilters, Vendor, VendorPackage } from '../types/package';

export interface CreatePackageRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  type?: 'diamond' | 'weekly' | 'monthly' | 'special' | 'subscription';
  gameId?: string;
  featured?: boolean;
  discount?: number;
  amount?: number;
  duration?: number;
  region: string;
  gameName: string;
  vendor: string;
  vendorPackageCodes: string[];
  vendorPrice: number;
  currency: string;
  status?: 'active' | 'inactive' | 'out_of_stock';
  stock?: number;
  resellKeyword?: string;
}

export interface UpdatePackageRequest extends Partial<CreatePackageRequest> {
  id?: string;
}

export interface PackagesResponse {
  success: boolean;
  packages: Package[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface PackageStatsResponse {
  success: boolean;
  stats: {
    totalPackages: number;
    activePackages: number;
    inactivePackages: number;
    outOfStockPackages: number;
    totalStock: number;
    averagePrice: number;
    topRegions: Array<{ region: string; count: number }>;
    topGames: Array<{ game: string; count: number }>;
    topVendors: Array<{ vendor: string; count: number }>;
  };
}

export interface StockUpdateRequest {
  stock: number;
  notes?: string;
}

export interface StockUpdateResponse {
  success: boolean;
  package: {
    id: string;
    stock: number;
  };
  message: string;
  stockUpdate: {
    previousStock: number;
    newStock: number;
    updatedBy: string;
    timestamp: string;
    notes: string | null;
  };
}

class PackageService {
  private baseUrl = '/packages';

  async getPackages(filters: PackageFilters = {}, page = 1, limit = 50): Promise<PackagesResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.region && filters.region !== 'all') {
        params.append('region', filters.region);
      }

      if (filters.gameName && filters.gameName !== 'all') {
        params.append('gameName', filters.gameName);
      }

      if (filters.vendor && filters.vendor !== 'all') {
        params.append('vendor', filters.vendor);
      }

      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }

      if (filters.search) {
        params.append('search', filters.search);
      }

      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }

      if (filters.sortOrder) {
        params.append('sortOrder', filters.sortOrder);
      }

      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await axiosInstance.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching packages:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch packages');
    }
  }

  async getAllPackages(): Promise<Package[]> {
    try {
      // Get all packages without pagination
      const response = await this.getPackages({}, 1, 10000); // Large limit to get all
      return response.packages;
    } catch (error: any) {
      console.error('Error fetching all packages:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch all packages');
    }
  }

  async getPackageStats(): Promise<any> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching package stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch package statistics');
    }
  }

  async getPackage(id: string): Promise<{ success: boolean; package: Package }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching package:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch package');
    }
  }

  async createPackage(packageData: CreatePackageRequest): Promise<any> {
    try {
      // Prepare the data for backend
      const backendData = {
        name: packageData.name,
        description: packageData.description,
        price: Number(packageData.price),
        imageUrl: packageData.imageUrl || '',
        region: packageData.region,
        gameName: packageData.gameName,
        vendor: packageData.vendor,
        vendorPackageCodes: packageData.vendorPackageCodes,
        vendorPrice: Number(packageData.vendorPrice),
        currency: packageData.currency,
        status: packageData.status?.toUpperCase() || 'ACTIVE',
        resellKeyword: packageData.resellKeyword || '',
        stock: packageData.stock ? Number(packageData.stock) : 0,
        discount: packageData.discount ? Number(packageData.discount) : 0,
        amount: packageData.amount ? Number(packageData.amount) : 0,
        // Optional fields
        ...(packageData.type && { type: packageData.type.toUpperCase() }),
        ...(packageData.gameId && { gameId: packageData.gameId }),
        ...(packageData.featured !== undefined && { featured: packageData.featured }),
        ...(packageData.duration && { duration: Number(packageData.duration) }),
      };

      console.log('Creating package with data:', backendData);

      const response = await axiosInstance.post(this.baseUrl, backendData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating package:', error);
      throw new Error(error.response?.data?.message || 'Failed to create package');
    }
  }

  async updatePackage(id: string, packageData: UpdatePackageRequest): Promise<{ success: boolean; package: Package; message: string }> {
    try {
      // Prepare the data for backend, only include fields that are provided
      const backendData: any = {};

      if (packageData.name !== undefined) backendData.name = packageData.name;
      if (packageData.description !== undefined) backendData.description = packageData.description;
      if (packageData.price !== undefined) backendData.price = Number(packageData.price);
      if (packageData.imageUrl !== undefined) backendData.imageUrl = packageData.imageUrl;
      if (packageData.region !== undefined) backendData.region = packageData.region;
      if (packageData.gameName !== undefined) backendData.gameName = packageData.gameName;
      if (packageData.vendor !== undefined) backendData.vendor = packageData.vendor;
      if (packageData.vendorPackageCodes !== undefined) backendData.vendorPackageCodes = packageData.vendorPackageCodes;
      if (packageData.vendorPrice !== undefined) backendData.vendorPrice = Number(packageData.vendorPrice);
      if (packageData.currency !== undefined) backendData.currency = packageData.currency;
      if (packageData.status !== undefined) backendData.status = packageData.status.toUpperCase();
      if (packageData.stock !== undefined) backendData.stock = Number(packageData.stock);
      if (packageData.discount !== undefined) backendData.discount = Number(packageData.discount);
      if (packageData.amount !== undefined) backendData.amount = Number(packageData.amount);

      // Optional fields
      if (packageData.type !== undefined) backendData.type = packageData.type.toUpperCase();
      if (packageData.gameId !== undefined) backendData.gameId = packageData.gameId;
      if (packageData.featured !== undefined) backendData.featured = packageData.featured;
      if (packageData.duration !== undefined) backendData.duration = Number(packageData.duration);

      console.log('Updating package with data:', backendData);

      const response = await axiosInstance.patch(`${this.baseUrl}/${id}`, backendData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating package:', error);
      throw new Error(error.response?.data?.message || 'Failed to update package');
    }
  }

  async deletePackage(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting package:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete package');
    }
  }

  async togglePackageStatus(id: string): Promise<{ success: boolean; package: { id: string; status: string }; message: string }> {
    try {
      const response = await axiosInstance.patch(`${this.baseUrl}/${id}/toggle-status`);
      return response.data;
    } catch (error: any) {
      console.error('Error toggling package status:', error);
      throw new Error(error.response?.data?.message || 'Failed to toggle package status');
    }
  }

  async updateStock(id: string, stockData: StockUpdateRequest): Promise<StockUpdateResponse> {
    try {
      const response = await axiosInstance.patch(`${this.baseUrl}/${id}/stock`, stockData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating package stock:', error);
      throw new Error(error.response?.data?.message || 'Failed to update package stock');
    }
  }

  async getVendors(): Promise<{ success: boolean; vendors: Vendor[] }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/vendors`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch vendors');
    }
  }

  async getRegions(): Promise<string[]> {
    try {
      // This could be a separate endpoint or derived from packages
      const response = await this.getPackages({}, 1, 1000);
      const regions = Array.from(new Set(response.packages.map(pkg => pkg.region)));
      return regions.sort();
    } catch (error: any) {
      console.error('Error fetching regions:', error);
      return ['Malaysia', 'Myanmar', 'Brazil', 'Singapore', 'Thailand']; // Fallback
    }
  }

  async getGames(): Promise<string[]> {
    try {
      // This could be a separate endpoint or derived from packages
      const response = await this.getPackages({}, 1, 1000);
      const games = Array.from(new Set(response.packages.map(pkg => pkg.gameName)));
      return games.sort();
    } catch (error: any) {
      console.error('Error fetching games:', error);
      return ['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Genshin Impact']; // Fallback
    }
  }

  async getVendorNames(): Promise<string[]> {
    try {
      // This could be a separate endpoint or derived from packages
      const response = await this.getPackages({}, 1, 1000);
      const vendors = Array.from(new Set(response.packages.map(pkg => pkg.vendor)));
      return vendors.sort();
    } catch (error: any) {
      console.error('Error fetching vendor names:', error);
      return ['Razor Gold', 'Smile', 'Garena', 'Tencent']; // Fallback
    }
  }

  async exportPackages(filters: PackageFilters = {}): Promise<{ success: boolean; data: any[]; total: number }> {
    try {
      const exportFilters = {
        region: filters.region !== 'all' ? filters.region : undefined,
        gameName: filters.gameName !== 'all' ? filters.gameName : undefined,
        vendor: filters.vendor !== 'all' ? filters.vendor : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        search: filters.search,
      };

      const response = await axiosInstance.post(`${this.baseUrl}/export`, exportFilters);
      return response.data;
    } catch (error: any) {
      console.error('Error exporting packages:', error);
      throw new Error(error.response?.data?.message || 'Failed to export packages');
    }
  }

  // Mock vendor packages for the modal (this could be replaced with real API)
  async getVendorPackages(vendor: string, region: string, gameName: string): Promise<VendorPackage[]> {
    try {
      // This is a mock implementation - replace with real API call
      const mockPackages: VendorPackage[] = [
        {
          code: '86',
          name: '86 Diamonds',
          price: 61.50,
          currency: 'MYR',
          diamonds: 86,
          description: 'Mobile Legends 86 Diamonds package'
        },
        {
          code: '172',
          name: '172 Diamonds',
          price: 122.00,
          currency: 'MYR',
          diamonds: 172,
          description: 'Mobile Legends 172 Diamonds package'
        },
        {
          code: 'wkp',
          name: 'Weekly Pass',
          price: 76.00,
          currency: 'MYR',
          description: 'Mobile Legends Weekly Diamond Pass'
        }
      ];

      // Filter based on vendor, region, game
      return mockPackages;
    } catch (error: any) {
      console.error('Error fetching vendor packages:', error);
      return [];
    }
  }
}

export default new PackageService();