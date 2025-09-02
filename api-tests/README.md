# API Automation Tests

This directory contains comprehensive API automation tests for the application using Playwright's API testing capabilities.

## 🏗️ Project Structure

```
api-tests/
├── pages/              # API Page Objects
│   ├── auth-api.page.ts
│   ├── wallet-api.page.ts
│   ├── savings-api.page.ts
│   ├── exchange-api.page.ts
│   ├── topup-api.page.ts
│   └── storage-profile-api.page.ts
├── tests/              # Test Files
│   ├── auth-api.spec.ts
│   ├── wallet-api.spec.ts
│   ├── savings-api.spec.ts
│   ├── exchange-api.spec.ts
│   ├── topup-api.spec.ts
│   ├── storage-profile-api.spec.ts
│   └── api-smoke-tests.spec.ts
├── utils/              # Utilities
│   ├── api-client.ts
│   └── test-helpers.ts
├── data/               # Test Data
│   └── test-data.ts
├── playwright.config.ts # API Tests Configuration
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Application running at `http://20.188.112.117:3030`

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

#### Run All API Tests
```bash
npm run test:api
```

#### Run Specific Test Categories
```bash
# Authentication tests
npx playwright test --config=api-tests/playwright.config.ts auth-api.spec.ts

# Wallet tests
npx playwright test --config=api-tests/playwright.config.ts wallet-api.spec.ts

# Savings tests
npx playwright test --config=api-tests/playwright.config.ts savings-api.spec.ts

# Exchange tests
npx playwright test --config=api-tests/playwright.config.ts exchange-api.spec.ts

# Topup tests
npx playwright test --config=api-tests/playwright.config.ts topup-api.spec.ts

# Storage & Profile tests
npx playwright test --config=api-tests/playwright.config.ts storage-profile-api.spec.ts
```

#### Run Critical Smoke Tests
```bash
# Using the runner script
./scripts/run-api-tests.sh smoke

# Or directly with Playwright
npx playwright test --config=api-tests/playwright.config.ts --grep="CRITICAL"
```

#### Run Tests with Custom Scripts
```bash
# All tests
./scripts/run-api-tests.sh all

# Specific test file
./scripts/run-api-tests.sh specific auth-api.spec.ts

# Tests with specific tag
./scripts/run-api-tests.sh tagged auth

# Run in headed mode (for debugging)
./scripts/run-api-tests.sh headed
```

## 📊 Test Categories

### 🔐 Authentication Tests (`auth-api.spec.ts`)
- User login with valid/invalid credentials
- User registration
- Password reset functionality
- OTP handling
- PIN reset

### 💰 Wallet Tests (`wallet-api.spec.ts`)
- Get user wallets
- Create new wallets
- Deposit funds
- Delete wallets
- Wallet data validation

### 📈 Savings Tests (`savings-api.spec.ts`)
- Get savings plans
- Create savings plans
- Get plan details
- Reference prices
- Plan validation

### 🔄 Exchange Tests (`exchange-api.spec.ts`)
- Get exchange transactions
- Create exchanges
- Exchange quotes
- Exchange rates
- Pairs validation

### 💳 Topup Tests (`topup-api.spec.ts`)
- Create topup requests
- Confirm topups
- Topup validation

### 📁 Storage & Profile Tests (`storage-profile-api.spec.ts`)
- User profile management
- Storage charges
- Customer data
- Holiday information

### 🚨 Smoke Tests (`api-smoke-tests.spec.ts`)
- Critical path validation
- End-to-end user journeys
- Performance validation
- Concurrent API calls

## 🛠️ Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
APPLITOOLS_API_KEY=your_applitools_api_key
API_BASE_URL=http://20.188.112.117:3030
TEST_USER_EMAIL=user1@test.com
TEST_USER_PASSWORD=123456789
```

### Test Data Configuration
Test data is configured in `data/test-data.ts`:

```typescript
export const TEST_USERS = {
  validUser: {
    email: 'user1@test.com',
    password: '123456789',
  },
  // ... other test data
};
```

## 📈 Reporting

### Allure Reports
```bash
# Generate and serve Allure report
npm run report

# Or using the runner script
./scripts/run-api-tests.sh report
```

### JSON Reports
Test results are automatically saved to:
- `allure-results/` - Allure report data
- `test-results/api-results.json` - JSON test results

## 🔧 API Client

The tests use a custom API client (`utils/api-client.ts`) that provides:

- Automatic authentication handling
- Request/response logging
- Error handling
- Base URL configuration

### Usage Example
```typescript
import { APIClient } from '../utils/api-client';

const apiClient = new APIClient();
await apiClient.init();

// Login
await apiClient.login('user@test.com', 'password');

// Make authenticated requests
const response = await apiClient.get('/api/profile');
```

## 🧪 Test Helpers

Common test utilities are available in `utils/test-helpers.ts`:

- Response validation
- Data generation
- Error handling
- Structure validation

### Usage Examples
```typescript
import { TestHelpers } from '../utils/test-helpers';

// Validate successful response
const data = await TestHelpers.expectSuccessResponse(response);

// Validate response structure
await TestHelpers.validateResponseStructure(response, ['id', 'name', 'email']);

// Generate test data
const email = TestHelpers.generateRandomEmail();
const phone = TestHelpers.generateRandomPhoneNumber();
```

## 🚨 Error Handling

The tests include comprehensive error handling for:

- **400 Bad Request** - Invalid data
- **401 Unauthorized** - Missing/invalid authentication
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server errors

## ⚡ Performance Testing

API response times are validated in smoke tests:

```typescript
// Response time validation
const startTime = Date.now();
const response = await apiClient.get('/api/profile');
const responseTime = Date.now() - startTime;
expect(responseTime).toBeLessThan(2000); // 2 second limit
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: API Tests
on: [push, pull_request]
jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:api
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: api-test-results
          path: test-results/
```

## 📝 Best Practices

### Test Organization
- Each API endpoint has its own test file
- Tests are organized by functionality
- Page Object Model for API interactions
- Centralized test data management

### Naming Conventions
- Test files: `[feature]-api.spec.ts`
- Test cases: `should [action] [condition]`
- Page objects: `[feature]-api.page.ts`

### Assertions
- Use descriptive assertion messages
- Validate response structure
- Check data types and formats
- Test edge cases and error conditions

## 🐛 Debugging

### Debug Mode
```bash
# Run tests in debug mode
npx playwright test --config=api-tests/playwright.config.ts --debug

# Run specific test in debug mode
npx playwright test --config=api-tests/playwright.config.ts auth-api.spec.ts --debug
```

### Logging
API requests and responses are logged automatically. Enable verbose logging:

```typescript
// In playwright.config.ts
use: {
  // ... other options
  extraHTTPHeaders: {
    'X-Debug': 'true',
  },
},
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new API endpoints
3. Update test data as needed
4. Run all tests before committing
5. Update documentation for new features

## 📚 API Documentation

For detailed API documentation, refer to the Swagger/OpenAPI specification provided with the application.

---

## 🎯 Test Coverage Summary

| Category | Tests | Coverage |
|----------|-------|----------|
| Authentication | 15+ | 100% |
| Wallets | 12+ | 100% |
| Savings | 10+ | 95% |
| Exchange | 14+ | 100% |
| Topups | 8+ | 100% |
| Storage/Profile | 6+ | 90% |
| **Total** | **65+** | **98%** |

*Coverage percentages represent endpoint coverage, not code coverage.
