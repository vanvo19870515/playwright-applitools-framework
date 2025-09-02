import { APIResponse } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { API_ENDPOINTS } from '../data/test-data';

export class ExchangeAPI {
  constructor(private apiClient: APIClient) {}

  async getExchanges(limit?: number): Promise<APIResponse> {
    const params = limit ? { limit: limit.toString() } : undefined;
    return await this.apiClient.get(API_ENDPOINTS.exchanges.getExchanges, params);
  }

  async createExchange(exchangeData: {
    from_amount: number;
    from_asset: string;
    from_wallet_id: number;
    to_asset: string;
    to_wallet_id: number;
    description?: string;
  }): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.exchanges.createExchange, exchangeData);
  }

  async getExchangeById(exchangeId: number): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.exchanges.getExchangeById(exchangeId));
  }

  async getExchangePairs(): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.exchanges.getPairs);
  }

  async getExchangeQuote(params: {
    from_asset: string;
    to_asset: string;
    from_amount: number;
  }): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.exchanges.getQuote, params);
  }

  async getExchangeRates(): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.exchanges.getRates);
  }
}
