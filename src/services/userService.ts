import axiosInstance from './axiosConfig';
import { User, UserFilters, UserStats } from '../types/user';

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  role: 'retailer' | 'reseller' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
  balance?: number;
  commission?: number;
  referralCode?: string;
  referredBy?: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id?: string;
  totalSpent?: number;
  totalOrders?: number;
  avatar?: string;
  totalEarnings?: number;
  downlineCount?: number;
  isVerified?: boolean;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface UserStatsResponse {
  success: boolean;
  stats: UserStats;
}

export interface RechargeRequest {
  amount: number;
  notes?: string;
}

export interface RechargeResponse {
  success: boolean;
  user: {
    id: string;
    balance: number;
  };
  message: string;
  transaction: {
    amount: number;
    previousBalance: number;
    newBalance: number;
    rechargedBy: string;
    timestamp: string;
  };
}

class UserService {
  private baseUrl = '/users';

  async getUsers(filters: UserFilters = {}, page = 1, limit = 50): Promise<UsersResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.role && filters.role !== 'all') {
        params.append('role', filters.role);
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
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  async getUserStats(): Promise<UserStatsResponse> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
    }
  }

  async getUser(id: string): Promise<{ success: boolean; user: User }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }

  async createUser(userData: CreateUserRequest): Promise<{ success: boolean; user: User; message: string }> {
    try {
      const response = await axiosInstance.post(this.baseUrl, userData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<{ success: boolean; user: User; message: string }> {
    try {
      const response = await axiosInstance.patch(`${this.baseUrl}/${id}`, userData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }

  async toggleUserStatus(id: string): Promise<{ success: boolean; user: { id: string; status: string }; message: string }> {
    try {
      const response = await axiosInstance.patch(`${this.baseUrl}/${id}/toggle-status`);
      return response.data;
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      throw new Error(error.response?.data?.message || 'Failed to toggle user status');
    }
  }

  async rechargeBalance(id: string, rechargeData: RechargeRequest): Promise<RechargeResponse> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/${id}/recharge`, rechargeData);
      return response.data;
    } catch (error: any) {
      console.error('Error recharging user balance:', error);
      throw new Error(error.response?.data?.message || 'Failed to recharge user balance');
    }
  }

  async resendSetupEmail(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post(`${this.baseUrl}/${id}/resend-setup`);
      return response.data;
    } catch (error: any) {
      console.error('Error resending setup email:', error);
      throw new Error(error.response?.data?.message || 'Failed to resend setup email');
    }
  }

  async exportUsers(filters: UserFilters = {}): Promise<{ success: boolean; data: any[]; total: number }> {
    try {
      const exportFilters = {
        role: filters.role !== 'all' ? filters.role : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        search: filters.search,
      };

      const response = await axiosInstance.post(`${this.baseUrl}/export`, exportFilters);
      return response.data;
    } catch (error: any) {
      console.error('Error exporting users:', error);
      throw new Error(error.response?.data?.message || 'Failed to export users');
    }
  }
}

export default new UserService();