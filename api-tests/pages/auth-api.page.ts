import { APIResponse } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { API_ENDPOINTS } from '../data/test-data';

export class AuthAPI {
  constructor(private apiClient: APIClient) {}

  async login(email: string, password: string): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.auth.login, {
      grant_type: 'password',
      email,
      password,
    });
  }

  async signup(userData: {
    email: string;
    password: string;
    name: string;
    phone_number: string;
  }): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.auth.signup, userData);
  }

  async forgotPassword(email: string): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.auth.forgotPassword, {
      email,
    });
  }

  async resetPassword(newPassword: string, token: string): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.auth.resetPassword, {
      new_password: newPassword,
      token,
    });
  }

  async sendPhoneOtp(phoneNumber: string, pinCode: string): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.auth.sendPhoneOtp, {
      grant_type: 'phone_otp',
      phone_number: phoneNumber,
      pin_code: pinCode,
    });
  }

  async resendOtp(phoneNumber: string): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.auth.resendOtp, {
      phone_number: phoneNumber,
    });
  }

  async forgotPin(phoneNumber: string): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.auth.forgotPin, {
      phone_number: phoneNumber,
    });
  }

  async resetPin(newPin: string, token: string): Promise<APIResponse> {
    return await this.apiClient.post(API_ENDPOINTS.auth.resetPin, {
      new_pin: newPin,
      token,
    });
  }
}
