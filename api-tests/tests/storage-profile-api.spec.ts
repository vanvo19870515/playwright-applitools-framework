import { test, expect } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { StorageAPI, ProfileAPI, CustomerAPI, HolidayAPI } from '../pages/storage-profile-api.page';
import { AuthAPI } from '../pages/auth-api.page';
import { TEST_USERS, RESPONSE_CODES } from '../data/test-data';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Storage, Profile and Customer API Tests', () => {
  let apiClient: APIClient;
  let storageAPI: StorageAPI;
  let profileAPI: ProfileAPI;
  let customerAPI: CustomerAPI;
  let holidayAPI: HolidayAPI;
  let authAPI: AuthAPI;
  let authToken: string;

  test.beforeEach(async () => {
    apiClient = new APIClient();
    await apiClient.init();
    authAPI = new AuthAPI(apiClient);
    storageAPI = new StorageAPI(apiClient);
    profileAPI = new ProfileAPI(apiClient);
    customerAPI = new CustomerAPI(apiClient);
    holidayAPI = new HolidayAPI(apiClient);

    // Login first to get authentication token
    const loginResponse = await authAPI.login(TEST_USERS.validUser.email, TEST_USERS.validUser.password);
    const loginData = await loginResponse.json();
    authToken = loginData.access_token;
    apiClient.setAuthToken(authToken);
  });

  test.afterEach(async () => {
    await apiClient.dispose();
  });

  test.describe('Profile API Tests', () => {
    test('should get user profile', async () => {
      const response = await profileAPI.getProfile();
      const profileData = await TestHelpers.expectSuccessResponse(response);

      expect(profileData).toHaveProperty('id');
      expect(profileData).toHaveProperty('email');
      expect(profileData).toHaveProperty('name');
      expect(profileData).toHaveProperty('phone_number');
      expect(profileData).toHaveProperty('avatar');
      expect(profileData).toHaveProperty('created_at');
      expect(profileData).toHaveProperty('updated_at');

      expect(profileData.email).toBe(TEST_USERS.validUser.email);
      expect(typeof profileData.id).toBe('number');
    });

    test('should update user profile', async () => {
      const updateData = {
        name: 'Updated Test User',
        avatar: 'https://example.com/avatar.jpg',
      };

      const response = await profileAPI.updateProfile(updateData);
      const updatedProfile = await TestHelpers.expectSuccessResponse(response);

      expect(updatedProfile.name).toBe(updateData.name);
      expect(updatedProfile.avatar).toBe(updateData.avatar);
      expect(updatedProfile.email).toBe(TEST_USERS.validUser.email); // Email should remain unchanged
    });

    test('should update profile with partial data', async () => {
      const partialUpdate = {
        name: 'Partially Updated User',
        // Only updating name, not avatar
      };

      const response = await profileAPI.updateProfile(partialUpdate);
      const updatedProfile = await TestHelpers.expectSuccessResponse(response);

      expect(updatedProfile.name).toBe(partialUpdate.name);
      // Avatar should remain from previous update or be null/empty
    });

    test('should fail to update profile with invalid data', async () => {
      const invalidUpdate = {
        name: '', // Empty name
      };

      const response = await profileAPI.updateProfile(invalidUpdate);
      await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
    });
  });

  test.describe('Storage Charges API Tests', () => {
    test('should get storage charges', async () => {
      const response = await storageAPI.getStorageCharges();
      const charges = await TestHelpers.validateArrayResponse(response);

      // Validate charge structure if any exist
      if (charges.items && charges.items.length > 0) {
        const firstCharge = charges.items[0];
        expect(firstCharge).toHaveProperty('id');
        expect(firstCharge).toHaveProperty('charge_amount');
        expect(firstCharge).toHaveProperty('created_at');
        expect(firstCharge).toHaveProperty('processing_date');
        expect(firstCharge).toHaveProperty('storage_charge_type');
        expect(firstCharge).toHaveProperty('wallet_asset');
        expect(firstCharge).toHaveProperty('wallet_balance');

        expect(typeof firstCharge.charge_amount).toBe('number');
        expect(firstCharge.charge_amount).toBeGreaterThanOrEqual(0);
      }
    });

    test('should get storage charge summary', async () => {
      const response = await storageAPI.getStorageChargeSummary();
      const summaryData = await TestHelpers.expectSuccessResponse(response);

      expect(summaryData).toHaveProperty('total_amount');
      expect(summaryData).toHaveProperty('total_charges');
      expect(summaryData).toHaveProperty('fiat_deduction_total');
      expect(summaryData).toHaveProperty('metal_sale_total');
      expect(summaryData).toHaveProperty('recent_charges');

      expect(typeof summaryData.total_amount).toBe('number');
      expect(typeof summaryData.total_charges).toBe('number');
      expect(typeof summaryData.fiat_deduction_total).toBe('number');
      expect(typeof summaryData.metal_sale_total).toBe('number');

      // Recent charges should be an array
      expect(Array.isArray(summaryData.recent_charges)).toBe(true);
    });

    test('should validate storage charge data structure', async () => {
      const chargesResponse = await storageAPI.getStorageCharges();
      const chargesData = await chargesResponse.json();

      if (chargesData.items && chargesData.items.length > 0) {
        chargesData.items.forEach((charge: any) => {
          expect(charge).toHaveProperty('id');
          expect(charge).toHaveProperty('charge_amount');
          expect(charge).toHaveProperty('created_at');
          expect(charge).toHaveProperty('updated_at');
          expect(charge).toHaveProperty('processing_date');
          expect(charge).toHaveProperty('storage_charge_type');
          expect(charge).toHaveProperty('metal_sold');
          expect(charge).toHaveProperty('price_currency');
          expect(charge).toHaveProperty('price_used');
          expect(charge).toHaveProperty('wallet_id');
          expect(charge).toHaveProperty('wallet_asset');
          expect(charge).toHaveProperty('wallet_balance');
          expect(charge).toHaveProperty('wallet_customer_id');
          expect(charge).toHaveProperty('wallet_user_name');

          expect(typeof charge.charge_amount).toBe('number');
          expect(typeof charge.metal_sold).toBe('number');
          expect(typeof charge.price_used).toBe('number');
          expect(typeof charge.wallet_balance).toBe('number');
        });
      }
    });
  });

  test.describe('Customer API Tests', () => {
    test('should get customers list', async () => {
      const response = await customerAPI.getCustomers();
      await TestHelpers.expectSuccessResponse(response);

      // Note: Depending on API permissions, this might return limited data
      // The test mainly validates that the endpoint is accessible
    });

    test('should handle customer API response format', async () => {
      const response = await customerAPI.getCustomers();
      const responseBody = await response.json();

      // Response could be an array or object depending on API design
      expect(responseBody).toBeDefined();
    });
  });

  test.describe('Holiday API Tests', () => {
    test('should get holidays list', async () => {
      const response = await holidayAPI.getHolidays();
      await TestHelpers.expectSuccessResponse(response);

      // Validate response is not empty
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();
    });

    test('should validate holiday data structure', async () => {
      const response = await holidayAPI.getHolidays();
      const holidaysData = await response.json();

      // If holidays exist, validate their structure
      if (Array.isArray(holidaysData) && holidaysData.length > 0) {
        holidaysData.forEach((holiday: any) => {
          expect(holiday).toHaveProperty('date');
          expect(holiday).toHaveProperty('name');
          expect(holiday).toHaveProperty('type');
        });
      }
    });
  });

  test.describe('Comprehensive Profile Tests', () => {
    test('should handle profile update edge cases', async () => {
      // Test with very long name
      const longName = 'A'.repeat(255); // Maximum length name
      const response = await profileAPI.updateProfile({ name: longName });

      if (response.status() === RESPONSE_CODES.SUCCESS) {
        const updatedProfile = await response.json();
        expect(updatedProfile.name).toBe(longName);
      } else {
        // API might reject very long names
        expect([RESPONSE_CODES.BAD_REQUEST, RESPONSE_CODES.SUCCESS]).toContain(response.status());
      }
    });

    test('should handle special characters in profile update', async () => {
      const specialName = 'Test Üser with Spëcial Chärs';
      const response = await profileAPI.updateProfile({ name: specialName });

      if (response.status() === RESPONSE_CODES.SUCCESS) {
        const updatedProfile = await response.json();
        expect(updatedProfile.name).toBe(specialName);
      }
    });

    test('should validate email format in profile', async () => {
      const profileResponse = await profileAPI.getProfile();
      const profileData = await profileResponse.json();

      // Validate email format using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(profileData.email)).toBe(true);
    });
  });

  test.describe('Storage Charges Data Validation', () => {
    test('should validate storage charge calculations', async () => {
      const summaryResponse = await storageAPI.getStorageChargeSummary();
      const summaryData = await summaryResponse.json();

      // Validate that totals are non-negative
      expect(summaryData.total_amount).toBeGreaterThanOrEqual(0);
      expect(summaryData.fiat_deduction_total).toBeGreaterThanOrEqual(0);
      expect(summaryData.metal_sale_total).toBeGreaterThanOrEqual(0);
      expect(summaryData.total_charges).toBeGreaterThanOrEqual(0);

      // Validate that fiat deduction + metal sale equals total amount (approximately)
      const calculatedTotal = summaryData.fiat_deduction_total + summaryData.metal_sale_total;
      expect(Math.abs(calculatedTotal - summaryData.total_amount)).toBeLessThan(0.01); // Allow for small rounding differences
    });

    test('should validate storage charge date formats', async () => {
      const chargesResponse = await storageAPI.getStorageCharges();
      const chargesData = await chargesResponse.json();

      if (chargesData.items && chargesData.items.length > 0) {
        chargesData.items.forEach((charge: any) => {
          // Validate date format (ISO 8601)
          const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
          expect(dateRegex.test(charge.created_at)).toBe(true);
          expect(dateRegex.test(charge.processing_date)).toBe(true);
        });
      }
    });
  });
});
