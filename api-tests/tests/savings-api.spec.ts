import { test, expect } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { SavingsAPI } from '../pages/savings-api.page';
import { AuthAPI } from '../pages/auth-api.page';
import { WalletAPI } from '../pages/wallet-api.page';
import { TEST_USERS, TEST_DATA, RESPONSE_CODES } from '../data/test-data';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Savings API Tests', () => {
  let apiClient: APIClient;
  let savingsAPI: SavingsAPI;
  let authAPI: AuthAPI;
  let walletAPI: WalletAPI;
  let authToken: string;
  let sourceWalletId: number;
  let targetWalletId: number;

  test.beforeEach(async () => {
    apiClient = new APIClient();
    await apiClient.init();
    authAPI = new AuthAPI(apiClient);
    walletAPI = new WalletAPI(apiClient);
    savingsAPI = new SavingsAPI(apiClient);

    // Login first to get authentication token
    const loginResponse = await authAPI.login(TEST_USERS.validUser.email, TEST_USERS.validUser.password);
    const loginData = await loginResponse.json();
    authToken = loginData.access_token;
    apiClient.setAuthToken(authToken);

    // Get existing wallets for testing
    const walletsResponse = await walletAPI.getWallets();
    const walletsData = await walletsResponse.json();

    if (walletsData.wallets && walletsData.wallets.length > 0) {
      sourceWalletId = walletsData.wallets[0].id;

      // Find or create a target wallet (gold wallet)
      const goldWallet = walletsData.wallets.find((w: any) => w.asset === 'XAU');
      if (goldWallet) {
        targetWalletId = goldWallet.id;
      } else {
        // Create a gold wallet if it doesn't exist
        const createWalletResponse = await walletAPI.createWallet({
          asset: 'XAU',
          name: 'Gold Savings Wallet',
          is_safe: true,
        });
        const createData = await createWalletResponse.json();
        targetWalletId = createData.wallet.id;
      }
    }
  });

  test.afterEach(async () => {
    await apiClient.dispose();
  });

  test('should get savings plans', async () => {
    const response = await savingsAPI.getSavingsPlans();
    const plans = await TestHelpers.validateArrayResponse(response);

    // Validate plan structure if any exist
    if (plans.plans && plans.plans.length > 0) {
      const firstPlan = plans.plans[0];
      expect(firstPlan).toHaveProperty('id');
      expect(firstPlan).toHaveProperty('status');
      expect(firstPlan).toHaveProperty('target_value');
      expect(firstPlan).toHaveProperty('savings_goal_type');
      expect(['plan', 'goal']).toContain(firstPlan.savings_goal_type);
    }
  });

  test('should create a savings plan', async () => {
    const planData = {
      ...TEST_DATA.savings.validPlan,
      source_wallet_id: sourceWalletId,
      target_metal_id: targetWalletId,
      description: `Test Savings Plan ${Date.now()}`,
    };

    const response = await savingsAPI.createSavingsPlan(planData);
    const responseBody = await TestHelpers.expectSuccessResponse(response);

    expect(responseBody).toHaveProperty('message');
    expect(responseBody).toHaveProperty('plan_id');
    expect(typeof responseBody.plan_id).toBe('number');
  });

  test('should fail to create savings plan with invalid dates', async () => {
    const invalidPlanData = {
      ...TEST_DATA.savings.validPlan,
      source_wallet_id: sourceWalletId,
      start_date: '2024-12-31', // Start date after end date
      end_date: '2024-01-01',
    };

    const response = await savingsAPI.createSavingsPlan(invalidPlanData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should fail to create savings plan with invalid wallet IDs', async () => {
    const invalidPlanData = {
      ...TEST_DATA.savings.validPlan,
      source_wallet_id: 999999, // Non-existent wallet
      target_metal_id: targetWalletId,
    };

    const response = await savingsAPI.createSavingsPlan(invalidPlanData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should get savings plan by ID', async () => {
    // First create a plan to get its ID
    const planData = {
      ...TEST_DATA.savings.validPlan,
      source_wallet_id: sourceWalletId,
      target_metal_id: targetWalletId,
      description: `Test Plan for Get ${Date.now()}`,
    };

    const createResponse = await savingsAPI.createSavingsPlan(planData);
    const createData = await createResponse.json();
    const planId = createData.plan_id;

    // Now get the plan by ID
    const response = await savingsAPI.getSavingsPlanById(planId.toString());
    const planDetails = await TestHelpers.expectSuccessResponse(response);

    expect(planDetails).toHaveProperty('plan');
    expect(planDetails.plan.id).toBe(planId);
    expect(planDetails.plan.description).toBe(planData.description);
  });

  test('should fail to get non-existent savings plan', async () => {
    const response = await savingsAPI.getSavingsPlanById('999999');
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.NOT_FOUND);
  });

  test('should get savings plans table', async () => {
    const response = await savingsAPI.getSavingsPlansTable();
    await TestHelpers.expectSuccessResponse(response);

    // The response should be HTML content for HTMX
    const responseText = await response.text();
    expect(typeof responseText).toBe('string');
    expect(responseText.length).toBeGreaterThan(0);
  });

  test('should get savings plans table with filters', async () => {
    const params = {
      status: 'active',
      page: 1,
      limit: 10,
    };

    const response = await savingsAPI.getSavingsPlansTable(params);
    await TestHelpers.expectSuccessResponse(response);
  });

  test('should get savings plan details fragment', async () => {
    // First create a plan
    const planData = {
      ...TEST_DATA.savings.validPlan,
      source_wallet_id: sourceWalletId,
      target_metal_id: targetWalletId,
      description: `Test Plan for Fragment ${Date.now()}`,
    };

    const createResponse = await savingsAPI.createSavingsPlan(planData);
    const createData = await createResponse.json();
    const planId = createData.plan_id;

    // Get the details fragment
    const response = await savingsAPI.getSavingsPlanDetailsFragment(planId.toString());
    await TestHelpers.expectSuccessResponse(response);

    // Should return HTML content
    const responseText = await response.text();
    expect(typeof responseText).toBe('string');
  });

  test('should get reference prices', async () => {
    const response = await savingsAPI.getReferencePrices();
    const pricesData = await TestHelpers.expectSuccessResponse(response);

    expect(pricesData).toHaveProperty('prices');
    expect(typeof pricesData.prices).toBe('object');

    // Validate price structure if data exists
    const prices = pricesData.prices;
    if (Object.keys(prices).length > 0) {
      const firstAsset = Object.keys(prices)[0];
      const firstAssetPrices = prices[firstAsset];

      expect(typeof firstAssetPrices).toBe('object');

      if (Object.keys(firstAssetPrices).length > 0) {
        const firstCurrency = Object.keys(firstAssetPrices)[0];
        const priceInfo = firstAssetPrices[firstCurrency];

        expect(priceInfo).toHaveProperty('price');
        expect(priceInfo).toHaveProperty('currency');
        expect(priceInfo).toHaveProperty('date');
        expect(typeof priceInfo.price).toBe('number');
      }
    }
  });

  test('should validate savings plan data structure', async () => {
    const plansResponse = await savingsAPI.getSavingsPlans();
    const plansData = await plansResponse.json();

    if (plansData.plans && plansData.plans.length > 0) {
      plansData.plans.forEach((plan: any) => {
        expect(plan).toHaveProperty('id');
        expect(plan).toHaveProperty('customer_id');
        expect(plan).toHaveProperty('source_wallet_id');
        expect(plan).toHaveProperty('target_value');
        expect(plan).toHaveProperty('start_date');
        expect(plan).toHaveProperty('end_date');
        expect(plan).toHaveProperty('status');
        expect(plan).toHaveProperty('savings_goal_type');
        expect(['plan', 'goal']).toContain(plan.savings_goal_type);
        expect(plan).toHaveProperty('frequency');
        expect(plan).toHaveProperty('remaining_frequency');
        expect(plan).toHaveProperty('created_at');
        expect(plan).toHaveProperty('updated_at');
      });
    }
  });
});
