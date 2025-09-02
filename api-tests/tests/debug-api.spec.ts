import { test, expect } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { AuthAPI } from '../pages/auth-api.page';
import { TEST_USERS } from '../data/test-data';

test.describe('API Debug Tests - Step by Step Validation', () => {
  let apiClient: APIClient;
  let authAPI: AuthAPI;

  test.beforeEach(async () => {
    apiClient = new APIClient();
    await apiClient.init();
    authAPI = new AuthAPI(apiClient);
  });

  test.afterEach(async () => {
    await apiClient.dispose();
  });

  test('DEBUG: Test basic connectivity to API server', async () => {
    // Test basic connectivity
    const response = await apiClient.context.get('http://20.188.112.117:3030/');
    console.log('Basic connectivity status:', response.status());

    // Just check if server is responding (could be 200, 302, etc.)
    expect([200, 302, 403, 404]).toContain(response.status());
  });

  test('DEBUG: Test login endpoint directly', async () => {
    const response = await apiClient.post('/api/auth/login', {
      grant_type: 'password',
      email: TEST_USERS.validUser.email,
      password: TEST_USERS.validUser.password,
    });

    console.log('Login response status:', response.status());
    console.log('Login response headers:', response.headers());

    try {
      const responseBody = await response.json();
      console.log('Login response body:', JSON.stringify(responseBody, null, 2));
    } catch (error) {
      console.log('Failed to parse response body:', error);
      const textBody = await response.text();
      console.log('Raw response body:', textBody);
    }

    // Accept any response for debugging
    expect(response.status()).toBeDefined();
  });

  test('DEBUG: Test invalid login endpoint', async () => {
    const response = await apiClient.post('/api/auth/login', {
      grant_type: 'password',
      email: 'invalid@test.com',
      password: 'wrongpassword',
    });

    console.log('Invalid login response status:', response.status());

    try {
      const responseBody = await response.json();
      console.log('Invalid login response body:', JSON.stringify(responseBody, null, 2));
    } catch (error) {
      console.log('Failed to parse response body:', error);
      const textBody = await response.text();
      console.log('Raw response body:', textBody);
    }

    expect(response.status()).toBeDefined();
  });

  test('DEBUG: Test profile endpoint without auth', async () => {
    const response = await apiClient.get('/api/me/profile');

    console.log('Profile without auth status:', response.status());

    try {
      const responseBody = await response.json();
      console.log('Profile response body:', JSON.stringify(responseBody, null, 2));
    } catch (error) {
      console.log('Failed to parse response body:', error);
      const textBody = await response.text();
      console.log('Raw response body:', textBody);
    }

    expect(response.status()).toBeDefined();
  });

  test('DEBUG: Test wallets endpoint without auth', async () => {
    const response = await apiClient.get('/api/wallets');

    console.log('Wallets without auth status:', response.status());

    try {
      const responseBody = await response.json();
      console.log('Wallets response body:', JSON.stringify(responseBody, null, 2));
    } catch (error) {
      console.log('Failed to parse response body:', error);
      const textBody = await response.text();
      console.log('Raw response body:', textBody);
    }

    expect(response.status()).toBeDefined();
  });

  test('DEBUG: Test exchange rates endpoint without auth', async () => {
    const response = await apiClient.get('/api/exchanges/rates');

    console.log('Exchange rates without auth status:', response.status());

    try {
      const responseBody = await response.json();
      console.log('Exchange rates response body:', JSON.stringify(responseBody, null, 2));
    } catch (error) {
      console.log('Failed to parse response body:', error);
      const textBody = await response.text();
      console.log('Raw response body:', textBody);
    }

    expect(response.status()).toBeDefined();
  });

  test('DEBUG: Test signup endpoint', async () => {
    const randomEmail = `debug${Date.now()}@test.com`;

    const response = await apiClient.post('/api/signup', {
      email: randomEmail,
      password: 'DebugPassword123',
      name: 'Debug User',
      phone_number: '+1234567890',
    });

    console.log('Signup response status:', response.status());

    try {
      const responseBody = await response.json();
      console.log('Signup response body:', JSON.stringify(responseBody, null, 2));
    } catch (error) {
      console.log('Failed to parse response body:', error);
      const textBody = await response.text();
      console.log('Raw response body:', textBody);
    }

    expect(response.status()).toBeDefined();
  });

  test('DEBUG: Test forgot password endpoint', async () => {
    const response = await apiClient.post('/api/auth/forgot-password', {
      email: TEST_USERS.validUser.email,
    });

    console.log('Forgot password response status:', response.status());

    try {
      const responseBody = await response.json();
      console.log('Forgot password response body:', JSON.stringify(responseBody, null, 2));
    } catch (error) {
      console.log('Failed to parse response body:', error);
      const textBody = await response.text();
      console.log('Raw response body:', textBody);
    }

    expect(response.status()).toBeDefined();
  });
});
