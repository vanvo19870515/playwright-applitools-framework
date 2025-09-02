import { test, expect } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { ExchangeAPI } from '../pages/exchange-api.page';
import { AuthAPI } from '../pages/auth-api.page';
import { WalletAPI } from '../pages/wallet-api.page';
import { TEST_USERS, TEST_DATA, RESPONSE_CODES } from '../data/test-data';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Exchange API Tests', () => {
  let apiClient: APIClient;
  let exchangeAPI: ExchangeAPI;
  let authAPI: AuthAPI;
  let walletAPI: WalletAPI;
  let authToken: string;
  let usdWalletId: number;
  let goldWalletId: number;

  test.beforeEach(async () => {
    apiClient = new APIClient();
    await apiClient.init();
    authAPI = new AuthAPI(apiClient);
    walletAPI = new WalletAPI(apiClient);
    exchangeAPI = new ExchangeAPI(apiClient);

    // Login first to get authentication token
    const loginResponse = await authAPI.login(TEST_USERS.validUser.email, TEST_USERS.validUser.password);
    const loginData = await loginResponse.json();
    authToken = loginData.access_token;
    apiClient.setAuthToken(authToken);

    // Get or create wallets for testing
    const walletsResponse = await walletAPI.getWallets();
    const walletsData = await walletsResponse.json();

    if (walletsData.wallets && walletsData.wallets.length > 0) {
      const usdWallet = walletsData.wallets.find((w: any) => w.asset === 'USD');
      const goldWallet = walletsData.wallets.find((w: any) => w.asset === 'XAU');

      usdWalletId = usdWallet ? usdWallet.id : walletsData.wallets[0].id;
      goldWalletId = goldWallet ? goldWallet.id : usdWalletId;

      // Create gold wallet if it doesn't exist
      if (!goldWallet) {
        const createWalletResponse = await walletAPI.createWallet({
          asset: 'XAU',
          name: 'Gold Exchange Wallet',
          is_safe: true,
        });
        const createData = await createWalletResponse.json();
        goldWalletId = createData.wallet.id;
      }
    }
  });

  test.afterEach(async () => {
    await apiClient.dispose();
  });

  test('should get user exchanges', async () => {
    const response = await exchangeAPI.getExchanges();
    const exchanges = await TestHelpers.validateArrayResponse(response);

    // Validate exchange structure if any exist
    if (exchanges.length > 0) {
      const firstExchange = exchanges[0];
      expect(firstExchange).toHaveProperty('id');
      expect(firstExchange).toHaveProperty('exchange_number');
      expect(firstExchange).toHaveProperty('status');
      expect(firstExchange).toHaveProperty('from_amount');
      expect(firstExchange).toHaveProperty('to_amount');
      expect(firstExchange).toHaveProperty('exchange_rate');
    }
  });

  test('should get exchanges with limit', async () => {
    const response = await exchangeAPI.getExchanges(5);
    const exchanges = await TestHelpers.validateArrayResponse(response);

    expect(exchanges.length).toBeLessThanOrEqual(5);
  });

  test('should create an exchange transaction', async () => {
    const exchangeData = {
      ...TEST_DATA.exchange.validExchange,
      from_wallet_id: usdWalletId,
      to_wallet_id: goldWalletId,
      from_amount: 100,
      description: `Test Exchange ${Date.now()}`,
    };

    const response = await exchangeAPI.createExchange(exchangeData);
    const responseBody = await TestHelpers.expectSuccessResponse(response);

    expect(responseBody).toHaveProperty('exchange_id');
    expect(responseBody).toHaveProperty('exchange_number');
    expect(responseBody).toHaveProperty('exchange_rate');
    expect(responseBody).toHaveProperty('from_amount');
    expect(responseBody).toHaveProperty('to_amount');
    expect(responseBody).toHaveProperty('status');
    expect(responseBody).toHaveProperty('message');

    expect(responseBody.from_amount).toBe(exchangeData.from_amount);
    expect(typeof responseBody.exchange_rate).toBe('number');
    expect(responseBody.exchange_rate).toBeGreaterThan(0);
  });

  test('should fail to create exchange with invalid wallet IDs', async () => {
    const invalidExchangeData = {
      ...TEST_DATA.exchange.validExchange,
      from_wallet_id: 999999, // Non-existent wallet
      to_wallet_id: goldWalletId,
    };

    const response = await exchangeAPI.createExchange(invalidExchangeData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should fail to create exchange with negative amount', async () => {
    const invalidExchangeData = {
      ...TEST_DATA.exchange.validExchange,
      from_wallet_id: usdWalletId,
      to_wallet_id: goldWalletId,
      from_amount: -100, // Negative amount
    };

    const response = await exchangeAPI.createExchange(invalidExchangeData);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should get exchange by ID', async () => {
    // First create an exchange to get its ID
    const exchangeData = {
      ...TEST_DATA.exchange.validExchange,
      from_wallet_id: usdWalletId,
      to_wallet_id: goldWalletId,
      from_amount: 50,
      description: `Test Exchange for Get ${Date.now()}`,
    };

    const createResponse = await exchangeAPI.createExchange(exchangeData);
    const createData = await createResponse.json();
    const exchangeId = createData.exchange_id;

    // Now get the exchange by ID
    const response = await exchangeAPI.getExchangeById(exchangeId);
    const exchangeDetails = await TestHelpers.expectSuccessResponse(response);

    expect(exchangeDetails).toHaveProperty('id');
    expect(exchangeDetails).toHaveProperty('exchange_number');
    expect(exchangeDetails).toHaveProperty('status');
    expect(exchangeDetails.id).toBe(exchangeId);
    expect(exchangeDetails.from_amount).toBe(exchangeData.from_amount);
  });

  test('should fail to get non-existent exchange', async () => {
    const response = await exchangeAPI.getExchangeById(999999);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.NOT_FOUND);
  });

  test('should get exchange pairs', async () => {
    const response = await exchangeAPI.getExchangePairs();
    const pairsData = await TestHelpers.expectSuccessResponse(response);

    expect(typeof pairsData).toBe('object');

    // Validate that pairs contain expected assets
    const expectedAssets = ['XAU', 'XAG', 'XPT', 'USD', 'SGD'];
    const availableAssets = Object.keys(pairsData);

    expectedAssets.forEach(asset => {
      expect(availableAssets).toContain(asset);
    });

    // Each asset should have an array of tradable pairs
    availableAssets.forEach(asset => {
      expect(Array.isArray(pairsData[asset])).toBe(true);
      pairsData[asset].forEach((pair: string) => {
        expect(typeof pair).toBe('string');
        expect(expectedAssets).toContain(pair);
      });
    });
  });

  test('should get exchange quote', async () => {
    const quoteParams = {
      from_asset: 'USD',
      to_asset: 'XAU',
      from_amount: 100,
    };

    const response = await exchangeAPI.getExchangeQuote(quoteParams);
    const quoteData = await TestHelpers.expectSuccessResponse(response);

    expect(quoteData).toHaveProperty('exchange_rate');
    expect(quoteData).toHaveProperty('from_amount');
    expect(quoteData).toHaveProperty('to_amount');
    expect(quoteData).toHaveProperty('from_asset');
    expect(quoteData).toHaveProperty('to_asset');

    expect(quoteData.from_asset).toBe(quoteParams.from_asset);
    expect(quoteData.to_asset).toBe(quoteParams.to_asset);
    expect(quoteData.from_amount).toBe(quoteParams.from_amount);
    expect(typeof quoteData.exchange_rate).toBe('number');
    expect(typeof quoteData.to_amount).toBe('number');
  });

  test('should fail to get exchange quote with invalid assets', async () => {
    const invalidQuoteParams = {
      from_asset: 'INVALID',
      to_asset: 'USD',
      from_amount: 100,
    };

    const response = await exchangeAPI.getExchangeQuote(invalidQuoteParams);
    await TestHelpers.expectErrorResponse(response, RESPONSE_CODES.BAD_REQUEST);
  });

  test('should get exchange rates', async () => {
    const response = await exchangeAPI.getExchangeRates();
    const ratesData = await TestHelpers.expectSuccessResponse(response);

    expect(typeof ratesData).toBe('object');

    // Validate rate structure
    const expectedAssets = ['XAU', 'XAG', 'XPT', 'USD', 'SGD'];
    const availableAssets = Object.keys(ratesData);

    expectedAssets.forEach(asset => {
      expect(availableAssets).toContain(asset);
      expect(typeof ratesData[asset]).toBe('object');

      // Each asset should have rates to other assets
      const assetRates = ratesData[asset];
      expect(typeof assetRates).toBe('object');

      Object.keys(assetRates).forEach(targetAsset => {
        expect(expectedAssets).toContain(targetAsset);
        expect(typeof assetRates[targetAsset]).toBe('number');
        expect(assetRates[targetAsset]).toBeGreaterThan(0);
      });
    });
  });

  test('should validate exchange data structure', async () => {
    const exchangesResponse = await exchangeAPI.getExchanges();
    const exchanges = await exchangesResponse.json();

    if (exchanges.length > 0) {
      exchanges.forEach((exchange: any) => {
        expect(exchange).toHaveProperty('id');
        expect(exchange).toHaveProperty('customer_id');
        expect(exchange).toHaveProperty('exchange_number');
        expect(exchange).toHaveProperty('status');
        expect(exchange).toHaveProperty('from_amount');
        expect(exchange).toHaveProperty('from_asset');
        expect(exchange).toHaveProperty('from_wallet_id');
        expect(exchange).toHaveProperty('to_amount');
        expect(exchange).toHaveProperty('to_asset');
        expect(exchange).toHaveProperty('to_wallet_id');
        expect(exchange).toHaveProperty('exchange_rate');
        expect(exchange).toHaveProperty('created_at');
        expect(exchange).toHaveProperty('updated_at');

        expect(typeof exchange.from_amount).toBe('number');
        expect(typeof exchange.to_amount).toBe('number');
        expect(typeof exchange.exchange_rate).toBe('number');
        expect(exchange.exchange_rate).toBeGreaterThan(0);
      });
    }
  });
});
