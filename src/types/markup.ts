// Markup type definition
export interface Markup {
  id: string;
  name: string;
  description?: string;
  percentageAdd?: number;
  flatAmountAdd?: number;
  markupType: 'percentage' | 'flat';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  isExpired: boolean;
  packageCount: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarkupFilters {
  isActive?: string;
  search?: string;
  markupType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MarkupStatsResponse {
  success: boolean;
  stats: {
    totalMarkups: number;
    activeMarkups: number;
    inactiveMarkups: number;
    percentageMarkups: number;
    flatMarkups: number;
    markupsWithPackages: number;
    unusedMarkups: number;
  };
}

export interface MarkupsResponse {
  success: boolean;
  markups: Markup[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface CreateMarkupRequest {
  name: string;
  description?: string;
  percentageAdd?: number;
  flatAmountAdd?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  createdBy?: string;
}

export interface UpdateMarkupRequest extends Partial<CreateMarkupRequest> {
  id?: string;
  updatedBy?: string;
}