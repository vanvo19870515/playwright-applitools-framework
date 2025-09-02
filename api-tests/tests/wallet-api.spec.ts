import { test, expect } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { WalletAPI } from '../pages/wallet-api.page';
import { AuthAPI } from '../pages/auth-api.page';
import { TEST_USERS, TEST_DATA, RESPONSE_CODES } from '../data/test-data';
import { TestHelpers, ValidationHelpers } from '../utils/test-helpers';

test.describe('Wallet API Tests', () => {
  let apiClient: APIClient;
  let walletAPI: WalletAPI;
  let authAPI: AuthAPI;
  let authToken: string;
  let createdWalletId: number;

  test.beforeEach(async () => {
    apiClient = new APIClient();
    await apiClient.init();
    authAPI = new AuthAPI(apiClient);
    walletAPI = new WalletAPI(apiClient);

    // Login first to get authentication token
    const loginResponse = await authAPI.login(TEST_USERS.validUser.email, TEST_USERS.validUser.password);
    const loginData = await loginResponse.json();
    authToken = loginData.access_token;
    apiClient.setAuthToken(authToken);
  });

  test.afterEach(async () => {
    await apiClient.dispose();
  });

  test('should get user wallets', async () => {
    const response = await walletAPI.getWallets();
    const wallets = await TestHelpers.validateArrayResponse(response);

    // Validate wallet structure
    if (wallets.length > 0) {
      const firstWallet = wallets[0];
      expect(firstWallet).toHaveProperty('id');
      expect(firstWallet).toHaveProperty('asset');
      expect(firstWallet).toHaveProperty('name');
      expect(firstWallet).toHaveProperty('balance');
      expect(firstWallet).toHaveProperty('is_default_wallet');
      expect(firstWallet).toHaveProperty('is_safe');
    }
  });

  test('should create a new wallet', async () => {
    const walletData = {
      ...TEST_DATA.wallet.validWallet,
      name: `Test Wallet ${Date.now()}`, // Ensure unique name
    };

    const response = await walletAPI.createWallet(walletData);
    const responseBody = await TestHelpers.expectSuccessResponse(response, RESPONSE_CODES.CREATED);

    // Validate response structure
    expect(responseBody).toHaveProperty('wallet');
    expect(responseBody.wallet).toHaveProperty('id');
    expect(responseBody.wallet).toHaveProperty('asset');
    expect(responseBody.wallet).toHaveProperty('name');
    expect(responseBody.wallet).toHaveProperty('balance');
    expect(responseBody.wallet.asset).toBe(walletData.asset);
    expect(responseBody.wallet.name).toBe(walletData.name);

    // Store wallet ID for cleanup
    createdWalletId = responseBody.wallet.id;
  });

  test('should create a gold wallet with safe flag', async () => {
    const walletData = {
      ...TEST_DATA.wallet.goldWallet,
      name: `Gold Wallet ${Date.now()}`, // Ensure unique name
    };

    const response = await walletAPI.createWallet(walletData);
    const responseBody = await TestHelpers.expectSuccessResponse(response, RESPONSE_CODES.CREATED);

    expect(responseBody.wallet.asset).toBe('XAU');
    expect(responseBody.wallet.is_safe).toBe(true);
    expect(responseBody.wallet.balance).toBe(0); // New wallet should start with 0 balance
  });

  test('should fail to create wallet with invalid asset', async () => {
    const invalidWalletData = {
      asset: 'INVALID',
      name: 'Invalid Asset Wallet',
    };

    const response = await walletAPI.createWallet(invalidWalletData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should fail to create wallet without required fields', async () => {
    const incompleteWalletData = {
      asset: 'USD',
      // Missing name
    };

    const response = await walletAPI.createWallet(incompleteWalletData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should deposit to wallet', async () => {
    // First, get existing wallets to find one to deposit to
    const walletsResponse = await walletAPI.getWallets();
    const wallets = await walletsResponse.json();

    expect(wallets.wallets).toBeDefined();
    expect(wallets.wallets.length).toBeGreaterThan(0);

    const firstWallet = wallets.wallets[0];
    const depositData = {
      amount: 100,
      asset: firstWallet.asset,
    };

    const response = await walletAPI.deposit(depositData);
    const responseBody = await TestHelpers.expectSuccessResponse(response);

    expect(responseBody).toHaveProperty('message');
  });

  test('should fail to deposit with invalid amount', async () => {
    const invalidDepositData = {
      amount: -100, // Negative amount
      asset: 'USD',
    };

    const response = await walletAPI.deposit(invalidDepositData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should fail to deposit with invalid asset', async () => {
    const invalidDepositData = {
      amount: 100,
      asset: 'INVALID',
    };

    const response = await walletAPI.deposit(invalidDepositData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should delete wallet', async () => {
    // First create a wallet to delete
    const walletData = {
      asset: 'USD',
      name: `Wallet to Delete ${Date.now()}`,
    };

    const createResponse = await walletAPI.createWallet(walletData);
    const createData = await createResponse.json();
    const walletIdToDelete = createData.wallet.id;

    // Now delete the wallet
    const deleteResponse = await walletAPI.deleteWallet(walletIdToDelete);
    await TestHelpers.expectSuccessResponse(deleteResponse);

    // Verify wallet is deleted by trying to get wallets
    const walletsResponse = await walletAPI.getWallets();
    const walletsData = await walletsResponse.json();
    const deletedWallet = walletsData.wallets.find((w: any) => w.id === walletIdToDelete);
    expect(deletedWallet).toBeUndefined();
  });

  test('should fail to delete non-existent wallet', async () => {
    const response = await walletAPI.deleteWallet(999999); // Non-existent ID
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.NOT_FOUND);
  });

  test('should validate wallet data structure', async () => {
    const walletsResponse = await walletAPI.getWallets();
    const walletsData = await walletsResponse.json();

    walletsData.wallets.forEach((wallet: any) => {
      expect(wallet).toHaveProperty('id');
      expect(typeof wallet.id).toBe('number');
      expect(wallet).toHaveProperty('asset');
      expect(['XAU', 'XAG', 'XPT', 'USD', 'SGD']).toContain(wallet.asset);
      expect(wallet).toHaveProperty('name');
      expect(typeof wallet.name).toBe('string');
      expect(wallet).toHaveProperty('balance');
      expect(typeof wallet.balance).toBe('number');
      expect(wallet.balance).toBeGreaterThanOrEqual(0);
      expect(wallet).toHaveProperty('is_default_wallet');
      expect(typeof wallet.is_default_wallet).toBe('boolean');
      expect(wallet).toHaveProperty('is_safe');
      expect(typeof wallet.is_safe).toBe('boolean');
    });
  });
});
