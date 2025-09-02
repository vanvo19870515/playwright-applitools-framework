import { APIResponse } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { API_ENDPOINTS } from '../data/test-data';

export class WalletAPI {
  constructor(private apiClient: APIClient) {}

  async getWallets(): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.wallets.getWallets);
  }

  async createWallet(walletData: {
    asset: string;
    name: string;
    is_safe?: boolean;
  }): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.wallets.createWallet, walletData);
  }

  async deposit(depositData: {
    amount: number;
    asset: string;
  }): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.wallets.deposit, depositData);
  }

  async deleteWallet(walletId: number): Promise<APIResponse> {
    return await this.apiClient.delete(API_ENDPOINTS.wallets.deleteWallet(walletId));
  }
}
