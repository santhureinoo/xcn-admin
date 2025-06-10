import axiosInstance from './axiosConfig';

export interface TransactionFilters {
  type?: string;
  status?: string;
  userRole?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
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

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  type: string;
  status: string;
  amount: number;
  totalCost: number;
  paymentMethod?: string;
  paymentReference?: string;
  paymentProof?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  adminNotes?: string;
  orders?: any[];
}

class TransactionService {
  private baseUrl = '/transactions';

  async getTransactions(
    filters: TransactionFilters = {},
    page = 1,
    limit = 50
  ): Promise<{
    success: boolean;
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  }> {
    try {
      const params = new URLSearchParams();

      if (filters.type && filters.type !== 'all') {
        params.append('type', filters.type);
      }
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.userRole && filters.userRole !== 'all') {
        params.append('userRole', filters.userRole);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
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
      throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }

  async getTransactionStats(): Promise<{ success: boolean; stats: TransactionStats }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch transaction stats');
    }
  }

  async updateTransactionStatus(
    id: string,
    status: string,
    adminNotes?: string
  ): Promise<{ success: boolean; transaction: Transaction; message: string }> {
    try {
      const response = await axiosInstance.patch(`${this.baseUrl}/${id}/status`, {
        status,
        adminNotes
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update transaction status');
    }
  }
}

export default new TransactionService();