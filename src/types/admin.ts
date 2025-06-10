export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'retailer' | 'reseller' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  balance: number;
  totalSpent: number;
  totalOrders: number;
  createdAt: string;
  lastLoginAt?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  // Reseller specific fields
  commission?: number; // percentage
  totalEarnings?: number;
  referralCode?: string;
  referredBy?: string;
  downlineCount?: number;
}

export interface UserFilters {
  role?: 'retailer' | 'reseller' | 'all';
  status?: 'active' | 'inactive' | 'suspended' | 'all';
  search?: string;
  sortBy?: 'name' | 'email' | 'balance' | 'totalSpent' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  totalUsers: number;
  totalRetailers: number;
  totalResellers: number;
  activeUsers: number;
  totalBalance: number;
  totalSpent: number;
}