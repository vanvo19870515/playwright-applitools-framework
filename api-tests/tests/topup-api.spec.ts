import { test, expect } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { TopupAPI } from '../pages/topup-api.page';
import { AuthAPI } from '../pages/auth-api.page';
import { WalletAPI } from '../pages/wallet-api.page';
import { TEST_USERS, TEST_DATA, RESPONSE_CODES } from '../data/test-data';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Topup API Tests', () => {
  let apiClient: APIClient;
  let topupAPI: TopupAPI;
  let authAPI: AuthAPI;
  let walletAPI: WalletAPI;
  let authToken: string;
  let walletId: number;
  let referenceCode: string;

  test.beforeEach(async () => {
    apiClient = new APIClient();
    await apiClient.init();
    authAPI = new AuthAPI(apiClient);
    walletAPI = new WalletAPI(apiClient);
    topupAPI = new TopupAPI(apiClient);

    // Login first to get authentication token
    const loginResponse = await authAPI.login(TEST_USERS.validUser.email, TEST_USERS.validUser.password);
    const loginData = await loginResponse.json();
    authToken = loginData.access_token;
    apiClient.setAuthToken(authToken);

    // Get existing wallet for testing
    const walletsResponse = await walletAPI.getWallets();
    const walletsData = await walletsResponse.json();

    if (walletsData.wallets && walletsData.wallets.length > 0) {
      walletId = walletsData.wallets[0].id;
    }
  });

  test.afterEach(async () => {
    await apiClient.dispose();
  });

  test('should create a topup request', async () => {
    const topupData = {
      ...TEST_DATA.topup.validTopup,
      wallet_id: walletId,
    };

    const response = await topupAPI.createTopup(topupData);
    const responseBody = await TestHelpers.expectSuccessResponse(response);

    expect(responseBody).toHaveProperty('reference');
    expect(typeof responseBody.reference).toBe('string');
    expect(responseBody.reference.length).toBeGreaterThan(0);

    // Store reference code for confirm test
    referenceCode = responseBody.reference;
  });

  test('should fail to create topup with invalid wallet ID', async () => {
    const invalidTopupData = {
      amount: 100,
      wallet_id: 999999, // Non-existent wallet
    };

    const response = await topupAPI.createTopup(invalidTopupData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should fail to create topup with negative amount', async () => {
    const invalidTopupData = {
      amount: -100, // Negative amount
      wallet_id: walletId,
    };

    const response = await topupAPI.createTopup(invalidTopupData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should fail to create topup with zero amount', async () => {
    const invalidTopupData = {
      amount: 0, // Zero amount
      wallet_id: walletId,
    };

    const response = await topupAPI.createTopup(invalidTopupData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should fail to create topup without required fields', async () => {
    const incompleteTopupData = {
      amount: 100,
      // Missing wallet_id
    };

    const response = await topupAPI.createTopup(incompleteTopupData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should confirm a topup request', async () => {
    // First create a topup to get reference code
    const topupData = {
      amount: 200,
      wallet_id: walletId,
    };

    const createResponse = await topupAPI.createTopup(topupData);
    const createData = await createResponse.json();
    const refCode = createData.reference;

    // Now confirm the topup
    const confirmResponse = await topupAPI.confirmTopup(refCode);
    const confirmData = await TestHelpers.expectSuccessResponse(confirmResponse);

    expect(confirmData).toHaveProperty('message');
    expect(typeof confirmData.message).toBe('string');
  });

  test('should fail to confirm non-existent topup', async () => {
    const response = await topupAPI.confirmTopup('INVALID-REF-123');
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.NOT_FOUND);
  });

  test('should fail to confirm topup with empty reference', async () => {
    const response = await topupAPI.confirmTopup('');
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should fail to confirm already confirmed topup', async () => {
    // First create and confirm a topup
    const topupData = {
      amount: 150,
      wallet_id: walletId,
    };

    const createResponse = await topupAPI.createTopup(topupData);
    const createData = await createResponse.json();
    const refCode = createData.reference;

    // Confirm it first time
    await topupAPI.confirmTopup(refCode);

    // Try to confirm again - this should fail
    const secondConfirmResponse = await topupAPI.confirmTopup(refCode);
    await TestHelpers.expectErrorResponse(secondConfirmResponse, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should handle large topup amounts', async () => {
    const largeTopupData = {
      amount: 1000000, // Large amount
      wallet_id: walletId,
    };

    const response = await topupAPI.createTopup(largeTopupData);
    const responseBody = await TestHelpers.expectSuccessResponse(response);

    expect(responseBody).toHaveProperty('reference');
  });

  test('should validate topup data structure', async () => {
    const topupData = {
      amount: 500,
      wallet_id: walletId,
    };

    const response = await topupAPI.createTopup(topupData);
    const responseBody = await response.json();

    // Validate reference code format (assuming it follows a pattern)
    expect(responseBody.reference).toMatch(/^[A-Z0-9-]+$/);

    // Confirm the topup and validate confirmation response
    const confirmResponse = await topupAPI.confirmTopup(responseBody.reference);
    const confirmBody = await confirmResponse.json();

    expect(confirmBody).toHaveProperty('message');
    expect(confirmBody.message.toLowerCase()).toMatch(/success|confirmed|processed/);
  });

  test('should create multiple topups concurrently', async () => {
    const topupPromises = [];

    // Create 3 topups concurrently
    for (let i = 0; i < 3; i++) {
      const topupData = {
        amount: 100 + i * 50, // Different amounts: 100, 150, 200
        wallet_id: walletId,
      };

      topupPromises.push(topupAPI.createTopup(topupData));
    }

    // Wait for all topups to complete
    const responses = await Promise.all(topupPromises);

    // Validate all responses
    responses.forEach(async (response) => {
      const responseBody = await response.json();
      expect(response.status()).toBe(RESPONSE_CODES.SUCCESS);
      expect(responseBody).toHaveProperty('reference');
      expect(typeof responseBody.reference).toBe('string');
    });

    // Ensure all reference codes are unique
    const referenceCodes = responses.map(async (response) => {
      const body = await response.json();
      return body.reference;
    });

    const resolvedRefs = await Promise.all(referenceCodes);
    const uniqueRefs = new Set(resolvedRefs);
    expect(uniqueRefs.size).toBe(resolvedRefs.length);
  });
});
