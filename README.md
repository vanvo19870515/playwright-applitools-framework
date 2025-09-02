# 🚀 QA Automation Suite

A comprehensive, containerized test automation framework combining **Playwright**, **Applitools Eyes**, **Allure Reporting**, and **n8n Workflow Automation** for end-to-end QA excellence.

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![Playwright](https://img.shields.io/badge/Playwright-45ba4b.svg?style=flat&logo=Playwright&logoColor=white)](https://playwright.dev)
[![Applitools](https://img.shields.io/badge/Applitools-1a73e8.svg?style=flat&logo=Applitools&logoColor=white)](https://applitools.com)
[![Allure](https://img.shields.io/badge/Allure-1b73ba.svg?style=flat&logo=Allure&logoColor=white)](https://qameta.io/allure-report)
[![n8n](https://img.shields.io/badge/n8n-ff6b35.svg?style=flat&logo=n8n&logoColor=white)](https://n8n.io)

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Services](#️-services)
- [📊 Usage](#-usage)
- [🔧 Configuration](#-configuration)
- [📈 Monitoring](#-monitoring)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)

## 🎯 Overview

This QA Automation Suite provides a complete testing ecosystem with:

- **🎭 Visual Testing**: Applitools Eyes for pixel-perfect UI validation
- **🔄 E2E Testing**: Playwright for cross-browser test automation
- **📊 Rich Reporting**: Allure for comprehensive test reports
- **⚡ Workflow Automation**: n8n for CI/CD pipeline orchestration
- **📈 Monitoring**: Prometheus + Grafana for performance insights
- **🐳 Containerization**: Docker for consistent environments

## 🏗️ Architecture

```
QA Automation Suite
├── 🧪 Test Execution (Playwright + Applitools)
├── 📊 Reporting (Allure)
├── ⚡ Workflow (n8n)
├── 📈 Monitoring (Prometheus + Grafana)
├── 🗄️ Database (PostgreSQL + Redis)
└── 🐳 Containerization (Docker Compose)
```

### Directory Structure

```
qa-automation-suite/
├── docker/                    # Docker configurations
│   ├── Dockerfile.playwright  # Test runner container
│   ├── Dockerfile.allure      # Allure server container
│   ├── Dockerfile.n8n         # n8n workflow container
│   ├── prometheus.yml         # Prometheus configuration
│   └── grafana/               # Grafana provisioning
├── tests/                     # Playwright test files
├── pages/                     # Page Object Models
├── workflows/                 # n8n workflow definitions
├── scripts/                   # Management scripts
├── docs/                      # Documentation
├── docker-compose.yml         # Main orchestration
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (latest versions)
- **Git** (for cloning)
- **4GB+ RAM** available
- **Ports 5678, 5050, 3000, 9090** available

### One-Command Setup

```bash
# Clone repository
git clone https://github.com/vanvo19870515/playwright-applitools-framework.git
cd playwright-applitools-framework

# Start entire suite
./scripts/start-all.sh
```

### Manual Setup

```bash
# 1. Clone and enter directory
git clone https://github.com/vanvo19870515/playwright-applitools-framework.git
cd playwright-applitools-framework

# 2. Create environment file
cp .env.example .env
# Edit .env with your API keys

# 3. Start core services
docker-compose --profile workflow up -d

# 4. Start monitoring (optional)
docker-compose --profile monitoring up -d

# 5. Run tests
./scripts/run-tests.sh
```

## 🛠️ Services

### Core Services

| Service | Port | Description | Profile |
|---------|------|-------------|---------|
| **n8n** | `5678` | Workflow automation & CI/CD | `workflow` |
| **Allure** | `5050` | Test reporting dashboard | `reporting` |
| **Grafana** | `3000` | Monitoring dashboards | `monitoring` |
| **Prometheus** | `9090` | Metrics collection | `monitoring` |
| **PostgreSQL** | `5432` | Primary database | `database` |
| **Redis** | `6379` | Cache & session store | `cache` |

### Test Services

| Service | Description | Profile |
|---------|-------------|---------|
| **Playwright Runner** | E2E test execution | `test` |
| **Applitools Eyes** | Visual testing | `test` |

## 📊 Usage

### Running Tests

```bash
# Run all tests
./scripts/run-tests.sh

# Run specific test file
docker-compose run --rm playwright-runner npx playwright test tests/login.spec.ts

# Run with specific browser
docker-compose run --rm playwright-runner npx playwright test --project=chromium

# Debug mode
docker-compose run --rm playwright-runner npx playwright test --debug
```

### Managing Services

```bash
# Start all services
./scripts/start-all.sh

# Start specific profiles
docker-compose --profile workflow up -d    # n8n only
docker-compose --profile test up -d        # Test services
docker-compose --profile monitoring up -d  # Monitoring stack

# View logs
./scripts/logs.sh

# Stop all services
./scripts/stop-all.sh
```

### n8n Workflows

Access n8n at `http://localhost:5678` (admin/admin123)

Pre-built workflows available in `workflows/`:
- **Test Execution Pipeline**: Automate test runs
- **Report Generation**: Auto-generate Allure reports
- **Notification System**: Slack/email notifications
- **CI/CD Integration**: GitHub Actions integration

### Monitoring

Access monitoring at:
- **Grafana**: `http://localhost:3000` (admin/admin123)
- **Prometheus**: `http://localhost:9090`

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Applitools Configuration
APPLITOOLS_API_KEY=your_applitools_api_key_here

# n8n Configuration
N8N_USER=admin
N8N_PASSWORD=secure_password
N8N_HOST=localhost

# Grafana Configuration
GRAFANA_USER=admin
GRAFANA_PASSWORD=secure_password

# Display (for GUI mode)
DISPLAY=:0
```

### Playwright Configuration

Located in `playwright.config.ts`:
- **Browsers**: Chromium, Firefox
- **Parallel execution**: Enabled
- **Test discovery**: `./tests/**/*.spec.ts`
- **Reporting**: Allure + Playwright HTML

### Custom Configurations

- **Docker**: `docker/` directory
- **n8n workflows**: `workflows/` directory
- **Monitoring**: `docker/grafana/` and `docker/prometheus.yml`

## 📈 Monitoring & Metrics

### Available Dashboards

1. **Test Execution Dashboard**
   - Test pass/fail rates
   - Execution time trends
   - Browser performance

2. **System Performance Dashboard**
   - CPU/Memory usage
   - Network I/O
   - Container health

3. **Workflow Automation Dashboard**
   - n8n workflow executions
   - Success/failure rates
   - Processing times

### Custom Metrics

The suite collects metrics for:
- Test execution times
- Visual comparison results
- Workflow execution stats
- System resource usage

## 📚 Documentation

### Getting Started
- [Setup Guide](docs/setup.md)
- [Configuration](docs/configuration.md)
- [Troubleshooting](docs/troubleshooting.md)

### Testing
- [Writing Tests](docs/writing-tests.md)
- [Page Objects](docs/page-objects.md)
- [Visual Testing](docs/visual-testing.md)

### Automation
- [n8n Workflows](docs/n8n-workflows.md)
- [CI/CD Integration](docs/ci-cd.md)
- [API Testing](docs/api-testing.md)

### Monitoring
- [Grafana Dashboards](docs/grafana-dashboards.md)
- [Prometheus Metrics](docs/prometheus-metrics.md)
- [Alerting](docs/alerting.md)

## 🧪 Test Examples

### Basic Login Test
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('username', 'password');

  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

### Visual Test with Applitools
```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('should match login page design', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.checkLayout(eyes, 'Login Page');
});
```

## 🤝 Contributing

### Development Setup

```bash
# Clone repository
git clone https://github.com/vanvo19870515/playwright-applitools-framework.git

# Install dependencies
npm install

# Start development environment
docker-compose -f docker-compose.dev.yml up -d
```

### Code Standards

- **TypeScript** for all test files
- **Page Object Model** for UI interactions
- **Descriptive test names** and assertions
- **Proper error handling** in workflows

### Pull Request Process

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/vanvo19870515/playwright-applitools-framework/issues)
- **Discussions**: [GitHub Discussions](https://github.com/vanvo19870515/playwright-applitools-framework/discussions)
- **Documentation**: [Wiki](https://github.com/vanvo19870515/playwright-applitools-framework/wiki)

## 🎯 Roadmap

- [ ] **AI-Powered Test Generation**
- [ ] **Mobile Testing Support**
- [ ] **Performance Testing Integration**
- [ ] **Multi-Environment Deployment**
- [ ] **Advanced Workflow Templates**
- [ ] **Real-time Collaboration Features**

---

**Happy Testing! 🧪✨**

Built with ❤️ for QA excellence