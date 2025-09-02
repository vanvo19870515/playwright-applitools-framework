export const TEST_USERS = {
  validUser: {
    email: 'user1@test.com',
    password: '123456789',
  },
  invalidUser: {
    email: 'invalid@test.com',
    password: 'wrongpassword',
  },
  newUser: {
    email: `testuser${Date.now()}@test.com`,
    password: 'TestPassword123',
    name: 'Test User',
    phone_number: '+1234567890',
  },
};

export const TEST_DATA = {
  wallet: {
    validWallet: {
      asset: 'USD',
      name: 'Test Wallet',
      is_safe: false,
    },
    goldWallet: {
      asset: 'XAU',
      name: 'Gold Wallet',
      is_safe: true,
    },
  },
  savings: {
    validPlan: {
      savings_goal_type: 'plan',
      source_wallet_id: 1,
      target_value: 1000,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      frequency: 12,
      description: 'Test Savings Plan',
      allocations: [
        {
          metal_id: 1,
          percentage: 100,
        },
      ],
    },
  },
  exchange: {
    validExchange: {
      from_asset: 'USD',
      to_asset: 'XAU',
      from_amount: 100,
      from_wallet_id: 1,
      to_wallet_id: 2,
    },
  },
  topup: {
    validTopup: {
      amount: 500,
      wallet_id: 1,
    },
  },
};

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/signup',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    sendPhoneOtp: '/api/auth/send-phone-otp',
    resendOtp: '/api/auth/resend-otp',
    forgotPin: '/api/auth/forgot-pin',
    resetPin: '/api/auth/reset-pin',
  },
  wallets: {
    getWallets: '/api/wallets',
    createWallet: '/api/wallets',
    deposit: '/api/wallets/deposit',
    deleteWallet: (id: number) => `/api/wallets/${id}`,
  },
  savings: {
    getPlans: '/api/savings/plans',
    createPlan: '/api/savings/plans',
    getPlanById: (id: string) => `/api/savings/plans/${id}`,
    getPlansTable: '/api/savings/plans-table',
    getPlanDetailsFragment: (id: string) => `/api/savings/plans/${id}/details-fragment`,
  },
  exchanges: {
    getExchanges: '/api/exchanges',
    createExchange: '/api/exchanges',
    getExchangeById: (id: number) => `/api/exchanges/${id}`,
    getPairs: '/api/exchanges/pairs',
    getQuote: '/api/exchanges/quote',
    getRates: '/api/exchanges/rates',
  },
  topups: {
    createTopup: '/api/topups',
    confirmTopup: (id: string) => `/api/topups/${id}/confirm`,
  },
  storage: {
    getCharges: '/api/storage-charges',
    getSummary: '/api/storage-charges/summary',
  },
  customers: {
    getCustomers: '/api/customers',
  },
  profile: {
    getProfile: '/api/me/profile',
    updateProfile: '/api/me/update',
  },
  holidays: {
    getHolidays: '/api/holidays',
  },
  prices: {
    getPrices: '/api/savings/prices',
  },
};

export const RESPONSE_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};
