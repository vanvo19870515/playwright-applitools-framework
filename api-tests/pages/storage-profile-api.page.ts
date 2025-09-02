import { APIResponse } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { API_ENDPOINTS } from '../data/test-data';

export class StorageAPI {
  constructor(private apiClient: APIClient) {}

  async getStorageCharges(): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.storage.getCharges);
  }

  async getStorageChargeSummary(): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.storage.getSummary);
  }
}

export class ProfileAPI {
  constructor(private apiClient: APIClient) {}

  async getProfile(): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.profile.getProfile);
  }

  async updateProfile(profileData: {
    name?: string;
    avatar?: string;
  }): Promise<APIResponse> {
    return await this.apiClient.put(API_ENDPOINTS.profile.updateProfile, profileData);
  }
}

export class CustomerAPI {
  constructor(private apiClient: APIClient) {}

  async getCustomers(): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.customers.getCustomers);
  }
}

export class HolidayAPI {
  constructor(private apiClient: APIClient) {}

  async getHolidays(): Promise<APIResponse> {
    return await this.apiClient.get(API_ENDPOINTS.holidays.getHolidays);
  }
}
