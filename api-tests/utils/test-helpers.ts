import { APIResponse, expect } from '@playwright/test';
import { RESPONSE_CODES } from '../data/test-data';

export class TestHelpers {
  static async expectSuccessResponse(response: APIResponse, expectedStatus: number = RESPONSE_CODES.SUCCESS) {
    expect(response.status()).toBe(expectedStatus);
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    return responseBody;
  }

  static async expectErrorResponse(response: APIResponse, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    return responseBody;
  }

  static async validateResponseStructure(response: APIResponse, requiredFields: string[]) {
    const responseBody = await response.json();
    for (const field of requiredFields) {
      expect(responseBody).toHaveProperty(field);
    }
    return responseBody;
  }

  static async validateArrayResponse(response: APIResponse, itemStructure?: string[]) {
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);

    if (itemStructure && responseBody.length > 0) {
      for (const field of itemStructure) {
        expect(responseBody[0]).toHaveProperty(field);
      }
    }

    return responseBody;
  }

  static generateRandomEmail(): string {
    return `testuser${Date.now()}@test.com`;
  }

  static generateRandomPhoneNumber(): string {
    return `+65${Math.floor(10000000 + Math.random() * 90000000)}`;
  }

  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async waitForResponse(response: Promise<APIResponse>, timeout: number = 5000): Promise<APIResponse> {
    return await Promise.race([
      response,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      ),
    ]);
  }
}

export class ValidationHelpers {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  static validatePassword(password: string): boolean {
    return password.length >= 8;
  }

  static validateAmount(amount: number): boolean {
    return amount > 0 && Number.isFinite(amount);
  }

  static validateWalletData(walletData: any): boolean {
    return (
      walletData.asset &&
      walletData.name &&
      typeof walletData.asset === 'string' &&
      typeof walletData.name === 'string'
    );
  }
}
