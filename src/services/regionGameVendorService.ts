import axiosInstance from './axiosConfig';
export interface RegionGameVendor {
  id: string;
  region: string;
  gameName: string;
  vendorName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegionGameVendorFilters {
  region?: string;
  gameName?: string;
  vendorName?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface RegionGameVendorResponse {
  success: boolean;
  data: RegionGameVendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

export interface SmileOneIntegrationInfo {
  triggered: boolean;
  reason: string;
  region?: string;
  gameName?: string;
  productCount: number;
  timestamp: string;
  error?: string;
}

export interface VendorsWithIntegrationResponse {
  success: boolean;
  data: string[];
  smileOneProducts?: any;
  integrationInfo?: SmileOneIntegrationInfo;
  message: string;
}

export interface CascadeDataResponse {
  success: boolean;
  data: {
    regions: string[];
    games: string[];
    vendors: string[];
    smileOneProducts?: any;
    integrationInfo?: SmileOneIntegrationInfo;
  };
  message: string;
  meta: {
    hasRegion: boolean;
    hasGame: boolean;
    canSelectGame: boolean;
    canSelectVendor: boolean;
    hasSmileOneIntegration?: boolean;
  };
}

export interface FilteredDataResponse {
  success: boolean;
  data: {
    regions: string[];
    games: string[];
    vendorNames: string[];
    smileOneProducts?: any[];
    integrationInfo?: SmileOneIntegrationInfo;
  };
  message: string;
}

export class RegionGameVendorService {
  // Get all region-game-vendor relationships
  static async getAll(filters: RegionGameVendorFilters = {}): Promise<RegionGameVendorResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.region && filters.region !== 'all') params.append('region', filters.region);
      if (filters.gameName && filters.gameName !== 'all') params.append('gameName', filters.gameName);
      if (filters.vendorName && filters.vendorName !== 'all') params.append('vendorName', filters.vendorName);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await axiosInstance.get(`/region-game-vendor?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch region-game-vendor relationships:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch region-game-vendor relationships');
    }
  }

  // Get unique regions
  static async getRegions(filters: { gameName?: string; vendorName?: string; isActive?: boolean } = {}): Promise<string[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.gameName && filters.gameName !== 'all') params.append('gameName', filters.gameName);
      if (filters.vendorName && filters.vendorName !== 'all') params.append('vendorName', filters.vendorName);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const response = await axiosInstance.get(`/region-game-vendor/regions?${params.toString()}`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Failed to fetch regions:', error);
      // Return fallback data
      return ['Malaysia', 'Myanmar', 'Brazil', 'Singapore', 'Thailand'];
    }
  }

  // Get unique games
  static async getGames(filters: { region?: string; vendorName?: string; isActive?: boolean } = {}): Promise<string[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.region && filters.region !== 'all') params.append('region', filters.region);
      if (filters.vendorName && filters.vendorName !== 'all') params.append('vendorName', filters.vendorName);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const response = await axiosInstance.get(`/region-game-vendor/games?${params.toString()}`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Failed to fetch games:', error);
      // Return fallback data
      return ['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Genshin Impact'];
    }
  }

  // Get unique vendor names with SmileOne integration
  static async getVendorNames(filters: { region?: string; gameName?: string; isActive?: boolean } = {}): Promise<VendorsWithIntegrationResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.region && filters.region !== 'all') params.append('region', filters.region);
      if (filters.gameName && filters.gameName !== 'all') params.append('gameName', filters.gameName);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const response = await axiosInstance.get(`/region-game-vendor/vendors?${params.toString()}`);
      
      // Log SmileOne integration info if present
      if (response.data.integrationInfo) {
        console.log('🎮 SmileOne Integration Info:', response.data.integrationInfo);
        
        if (response.data.smileOneProducts) {
          console.log('📦 SmileOne Products:', response.data.smileOneProducts);
        }
      }
      
      return {
        success: response.data.success,
        data: response.data.data || [],
        smileOneProducts: response.data.smileOneProducts,
        integrationInfo: response.data.integrationInfo,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Failed to fetch vendor names:', error);
      // Return fallback data
      return {
        success: false,
        data: ['Razor Gold', 'Smile', 'Garena', 'Tencent'],
        message: 'Failed to fetch vendor names, using fallback data'
      };
    }
  }

  // Get cascading filter data with SmileOne integration
  static async getCascadeData(filters: { region?: string; gameName?: string; vendorName?: string; isActive?: boolean } = {}): Promise<CascadeDataResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.region && filters.region !== 'all') params.append('region', filters.region);
      if (filters.gameName && filters.gameName !== 'all') params.append('gameName', filters.gameName);
      if (filters.vendorName && filters.vendorName !== 'all') params.append('vendorName', filters.vendorName);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());

      const response = await axiosInstance.get(`/region-game-vendor/cascade-data?${params.toString()}`);
      
      // Log SmileOne integration info if present
      if (response.data.data.integrationInfo) {
        console.log('🎮 SmileOne Integration Info:', response.data.data.integrationInfo);
        
        if (response.data.data.smileOneProducts) {
          console.log('📦 SmileOne Products:', response.data.data.smileOneProducts);
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch cascade data:', error);
      // Return fallback data
      return {
        success: false,
        data: {
          regions: ['Malaysia', 'Myanmar', 'Brazil', 'Singapore', 'Thailand'],
          games: ['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Genshin Impact'],
          vendors: ['Razor Gold', 'Smile', 'Garena', 'Tencent']
        },
        message: 'Failed to fetch cascade data, using fallback data',
        meta: {
          hasRegion: false,
          hasGame: false,
          canSelectGame: false,
          canSelectVendor: false
        }
      };
    }
  }

  // Get filtered data (all three arrays based on current selection) - Legacy method
  static async getFilteredData(filters: { region?: string; gameName?: string; vendorName?: string; isActive?: boolean } = {}): Promise<{
    regions: string[];
    games: string[];
    vendors: string[];
    smileOneProducts?: any[];
    integrationInfo?: SmileOneIntegrationInfo;
  }> {
    try {
      const cascadeResponse = await this.getCascadeData(filters);
      
      return {
        regions: cascadeResponse.data.regions,
        games: cascadeResponse.data.games,
        vendors: cascadeResponse.data.vendors,
        smileOneProducts: cascadeResponse.data.smileOneProducts,
        integrationInfo: cascadeResponse.data.integrationInfo
      };
    } catch (error: any) {
      console.error('Failed to fetch filtered data:', error);
      // Return fallback data
      return {
        regions: ['Malaysia', 'Myanmar', 'Brazil', 'Singapore', 'Thailand'],
        games: ['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Genshin Impact'],
        vendors: ['Razor Gold', 'Smile', 'Garena', 'Tencent']
      };
    }
  }

  // Create new relationship
  static async create(data: {
    region: string;
    gameName: string;
    vendorName: string;
    isActive?: boolean;
  }): Promise<RegionGameVendor> {
    try {
      const response = await axiosInstance.post('/region-game-vendor', data);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to create region-game-vendor relationship:', error);
      throw new Error(error.response?.data?.message || 'Failed to create region-game-vendor relationship');
    }
  }

  // Update relationship
  static async update(id: string, data: {
    region?: string;
    gameName?: string;
    vendorName?: string;
    isActive?: boolean;
  }): Promise<RegionGameVendor> {
    try {
      const response = await axiosInstance.put(`/region-game-vendor/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to update region-game-vendor relationship:', error);
      throw new Error(error.response?.data?.message || 'Failed to update region-game-vendor relationship');
    }
  }

  // Delete relationship
  static async delete(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(`/region-game-vendor/${id}`);
      return true;
    } catch (error: any) {
      console.error('Failed to delete region-game-vendor relationship:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete region-game-vendor relationship');
    }
  }

  // Toggle active status
  static async toggleStatus(id: string): Promise<RegionGameVendor> {
    try {
      const response = await axiosInstance.patch(`/region-game-vendor/${id}/toggle-status`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to toggle region-game-vendor relationship status:', error);
      throw new Error(error.response?.data?.message || 'Failed to toggle region-game-vendor relationship status');
    }
  }

  // Bulk create relationships
  static async bulkCreate(relationships: Array<{
    region: string;
    gameName: string;
    vendorName: string;
    isActive?: boolean;
  }>): Promise<{ created: number; skipped: number }> {
    try {
      const response = await axiosInstance.post('/region-game-vendor/bulk', { relationships });
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to bulk create region-game-vendor relationships:', error);
      throw new Error(error.response?.data?.message || 'Failed to bulk create region-game-vendor relationships');
    }
  }
}

export default RegionGameVendorService;