import { APIResponse } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { API_ENDPOINTS } from '../data/test-data';

export class SavingsAPI {
  constructor(private apiClient: APIClient) {}

  async getSavingsPlans(): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.savings.getPlans);
  }

  async createSavingsPlan(planData: {
    savings_goal_type: string;
    source_wallet_id: number;
    target_value: number;
    start_date: string;
    end_date: string;
    frequency: number;
    description?: string;
    allocations: Array<{
      metal_id: number;
      percentage: number;
    }>;
  }): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.savings.createPlan, planData);
  }

  async getSavingsPlanById(planId: string): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.savings.getPlanById(planId));
  }

  async getSavingsPlansTable(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.savings.getPlansTable, params);
  }

  async getSavingsPlanDetailsFragment(planId: string): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.savings.getPlanDetailsFragment(planId));
  }

  async getReferencePrices(): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.prices.getPrices);
  }
}
