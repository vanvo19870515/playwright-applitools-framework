import { APIResponse } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { API_ENDPOINTS } from '../data/test-data';

export class TopupAPI {
  constructor(private apiClient: APIClient) {}

  async createTopup(topupData: {
    amount: number;
    wallet_id: number;
  }): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.topups.createTopup, topupData);
  }

  async confirmTopup(referenceCode: string): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.topups.confirmTopup(referenceCode));
  }
}
