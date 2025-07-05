import axiosInstance from './axiosConfig';
import { Markup, MarkupFilters, MarkupsResponse, MarkupStatsResponse, CreateMarkupRequest, UpdateMarkupRequest } from '../types/markup';
import { MarkupOption } from '../types/package';

class MarkupService {
  private baseUrl = '/markups';

  async getMarkups(filters: MarkupFilters = {}, page = 1, limit = 50): Promise<MarkupsResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.isActive && filters.isActive !== 'all') {
        params.append('isActive', filters.isActive);
      }

      if (filters.markupType && filters.markupType !== 'all') {
        params.append('markupType', filters.markupType);
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
      console.error('Error fetching markups:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch markups');
    }
  }

  async getMarkupStats(): Promise<MarkupStatsResponse> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching markup stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch markup statistics');
    }
  }

  async getMarkup(id: string): Promise<{ success: boolean; markup: Markup }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching markup:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch markup');
    }
  }

  async createMarkup(markupData: CreateMarkupRequest): Promise<{ success: boolean; markup: Markup; message: string }> {
    try {
      const backendData = {
        name: markupData.name,
        description: markupData.description || '',
        percentageAdd: markupData.percentageAdd ? Number(markupData.percentageAdd) : null,
        flatAmountAdd: markupData.flatAmountAdd ? Number(markupData.flatAmountAdd) : null,
        isActive: markupData.isActive !== undefined ? markupData.isActive : true,
        startDate: markupData.startDate || null,
        endDate: markupData.endDate || null,
        createdBy: markupData.createdBy || null,
      };

      console.log('Creating markup with data:', backendData);

      const response = await axiosInstance.post(this.baseUrl, backendData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating markup:', error);
      throw new Error(error.response?.data?.message || 'Failed to create markup');
    }
  }

  async updateMarkup(id: string, markupData: UpdateMarkupRequest): Promise<{ success: boolean; markup: Markup; message: string }> {
    try {
      const backendData: any = {};

      if (markupData.name !== undefined) backendData.name = markupData.name;
      if (markupData.description !== undefined) backendData.description = markupData.description;
      if (markupData.percentageAdd !== undefined) backendData.percentageAdd = markupData.percentageAdd ? Number(markupData.percentageAdd) : null;
      if (markupData.flatAmountAdd !== undefined) backendData.flatAmountAdd = markupData.flatAmountAdd ? Number(markupData.flatAmountAdd) : null;
      if (markupData.isActive !== undefined) backendData.isActive = markupData.isActive;
      if (markupData.startDate !== undefined) backendData.startDate = markupData.startDate;
      if (markupData.endDate !== undefined) backendData.endDate = markupData.endDate;
      if (markupData.updatedBy !== undefined) backendData.updatedBy = markupData.updatedBy;

      console.log('Updating markup with data:', backendData);

      const response = await axiosInstance.patch(`${this.baseUrl}/${id}`, backendData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating markup:', error);
      throw new Error(error.response?.data?.message || 'Failed to update markup');
    }
  }

  async deleteMarkup(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting markup:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete markup');
    }
  }

  async toggleMarkupStatus(id: string): Promise<{ success: boolean; markup: { id: string; isActive: boolean }; message: string }> {
    try {
      const response = await axiosInstance.patch(`${this.baseUrl}/${id}/toggle-status`);
      return response.data;
    } catch (error: any) {
      console.error('Error toggling markup status:', error);
      throw new Error(error.response?.data?.message || 'Failed to toggle markup status');
    }
  }

  async getActiveMarkups(): Promise<{ success: boolean; markups: MarkupOption[] }> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/active`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching active markups:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch active markups');
    }
  }

  async exportMarkups(filters: MarkupFilters = {}): Promise<{ success: boolean; data: any[]; total: number }> {
    try {
      const exportFilters = {
        isActive: filters.isActive !== 'all' ? filters.isActive === 'true' : undefined,
        markupType: filters.markupType !== 'all' ? filters.markupType : undefined,
        search: filters.search,
      };

      const response = await axiosInstance.post(`${this.baseUrl}/export`, exportFilters);
      return response.data;
    } catch (error: any) {
      console.error('Error exporting markups:', error);
      throw new Error(error.response?.data?.message || 'Failed to export markups');
    }
  }
}

export default new MarkupService();