# 🎯 IDE Setup Guide - Playwright + Applitools Framework

> **Hướng dẫn đầy đủ cài đặt và cấu hình IDE cho project Playwright + Applitools Framework**

## 📋 Tổng quan Setup

Project này sử dụng các công nghệ:
- **Playwright** - Testing framework
- **Applitools Eyes** - Visual testing
- **TypeScript** - Programming language
- **Docker** - Containerization
- **API Testing** - REST API testing

---

## 🚀 Quick Setup (Khuyến nghị)

### Bước 1: Chạy Script Setup Tự động
```bash
# Setup tất cả mọi thứ
./scripts/setup-ide.sh

# Hoặc setup từng phần
./scripts/setup-ide.sh --vscode    # Chỉ setup VS Code
./scripts/setup-ide.sh --deps      # Chỉ setup dependencies
./scripts/setup-ide.sh --docker    # Chỉ setup Docker
```

### Bước 2: Mở Project trong VS Code
```bash
code .
```

### Bước 3: Cài đặt Extensions
VS Code sẽ tự động hiển thị popup yêu cầu cài đặt recommended extensions. Click **"Install All"**.

---

## 📦 Manual Setup (Chi tiết từng bước)

### 1️⃣ Cài đặt VS Code Extensions

#### **Essential Extensions:**
```
# TypeScript & JavaScript
ms-vscode.vscode-typescript-next
esbenp.prettier-vscode
ms-vscode.vscode-eslint

# Playwright Testing
ms-playwright.playwright
hbenl.vscode-test-explorer

# Docker
ms-azuretools.vscode-docker
ms-vscode-remote.remote-containers

# API Testing
humao.rest-client
bradlc.vscode-tailwindcss

# Git & Version Control
eamodio.gitlens
mhutchie.git-graph

# Code Quality
christian-kohler.path-intellisense
ms-vscode.vscode-json
redhat.vscode-yaml

# Productivity
ms-vscode.vscode-icons
formulahendry.auto-rename-tag

# Documentation
docsmsft.docs-markdown
yzhang.markdown-all-in-one
```

#### **Cách cài đặt:**
1. Mở VS Code
2. `Ctrl+Shift+P` (hoặc `Cmd+Shift+P` trên Mac)
3. Gõ "Extensions: Install Extensions"
4. Tìm và cài đặt từng extension

### 2️⃣ Cài đặt Dependencies

```bash
# Cài đặt npm dependencies
npm install

# Cài đặt Playwright browsers
npx playwright install
```

### 3️⃣ Cài đặt Docker (nếu chưa có)

```bash
# Download Docker Desktop
# https://www.docker.com/products/docker-desktop

# Kiểm tra cài đặt
docker --version
docker-compose --version
```

### 4️⃣ Cấu hình Git (nếu cần)

```bash
# Cấu hình Git user
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Kiểm tra cấu hình
git config --list
```

---

## ⚙️ VS Code Configuration Files

Project đã có sẵn các file cấu hình VS Code:

### 📁 `.vscode/settings.json`
- TypeScript auto-imports
- Format on save
- Prettier configuration
- Playwright settings
- Terminal configuration

### 📁 `.vscode/extensions.json`
- Recommended extensions list
- Unwanted extensions list

### 📁 `.vscode/launch.json`
- Debug configurations cho Playwright tests
- Debug API tests
- Debug current test file
- Allure report debugging

### 📁 `.vscode/tasks.json`
- Run UI tests
- Run API tests
- Generate reports
- Docker operations
- Install dependencies

---

## 🛠️ Development Tools

### **Required Tools:**
- ✅ **Node.js 18+** - Runtime environment
- ✅ **npm** - Package manager
- ✅ **Git** - Version control
- ✅ **Docker** - Containerization
- ✅ **VS Code** - IDE

### **Optional Tools:**
- **Postman/Insomnia** - API testing GUI
- **Chrome DevTools** - Web debugging
- **MongoDB Compass** - Database GUI

---

## 🧪 Testing Commands

### **Run Tests:**
```bash
# Run tất cả tests
npm run test

# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run smoke tests (critical path)
./scripts/run-api-tests.sh smoke
```

### **Debug Tests:**
```bash
# Debug mode
npm run test:ui -- --headed --debug

# Debug specific test file
npx playwright test tests/login.spec.ts --headed --debug
```

### **View Reports:**
```bash
# Allure report
npm run report

# HTML report
npx playwright show-report
```

---

## 🚀 Docker Operations

### **Start Services:**
```bash
# Start all services
./scripts/start-all.sh

# Start specific services
docker-compose up -d n8n postgres

# Start with profiles
docker-compose --profile workflow up -d
```

### **Stop Services:**
```bash
# Stop all services
./scripts/stop-all.sh

# Stop specific services
docker-compose down n8n postgres
```

### **View Logs:**
```bash
# View all logs
./scripts/logs.sh

# View specific service logs
docker-compose logs -f n8n
```

---

## 🔧 Troubleshooting

### **Permission Issues:**
```bash
# Fix file permissions
./scripts/fix-permissions.sh

# Fix node_modules permissions
sudo chown -R $(whoami) node_modules/
chmod -R 755 node_modules/
```

### **Port Conflicts:**
```bash
# Check port usage
lsof -i :3030
lsof -i :5432
lsof -i :5678

# Kill process using port
kill -9 <PID>
```

### **VS Code Issues:**
```bash
# Reload VS Code window
Ctrl+Shift+P → "Developer: Reload Window"

# Reset VS Code settings
# Delete .vscode/settings.json and restart
```

### **Playwright Issues:**
```bash
# Reinstall Playwright browsers
npx playwright install --force

# Update Playwright
npm update @playwright/test
```

### **Docker Issues:**
```bash
# Restart Docker Desktop
# Or restart Docker service
sudo systemctl restart docker

# Clear Docker cache
docker system prune -a
```

---

## 📚 Project Structure

```
playwright-applitools-framework/
├── 📁 api-tests/           # API testing framework
│   ├── 📁 pages/          # API page objects
│   ├── 📁 tests/          # API test files
│   ├── 📁 utils/          # API utilities
│   └── 📁 data/           # Test data
├── 📁 tests/              # UI tests
├── 📁 pages/              # UI page objects
├── 📁 scripts/            # Utility scripts
├── 📁 docker/             # Docker configurations
├── 📁 workflows/          # n8n workflows
├── 📁 .vscode/            # VS Code configurations
├── 📄 package.json        # Dependencies
├── 📄 playwright.config.ts # Playwright config
├── 📄 docker-compose.yml  # Docker services
└── 📄 README.md           # Documentation
```

---

## 🎯 Best Practices

### **Code Quality:**
- ✅ Use TypeScript strict mode
- ✅ Enable ESLint rules
- ✅ Format code with Prettier
- ✅ Use meaningful variable names

### **Testing:**
- ✅ Write descriptive test names
- ✅ Use Page Object Model
- ✅ Handle test data properly
- ✅ Add proper assertions

### **Git Workflow:**
- ✅ Commit frequently
- ✅ Write meaningful commit messages
- ✅ Use feature branches
- ✅ Review code before merging

### **Performance:**
- ✅ Use test parallelization
- ✅ Optimize Docker images
- ✅ Monitor resource usage
- ✅ Clean up old containers

---

## 📞 Support

### **Quick Help:**
```bash
# Check all tools status
./scripts/setup-ide.sh --dev-tools

# Run diagnostics
npm run test:api -- --dry-run
```

### **Common Issues:**
1. **Tests failing** → Check API endpoints
2. **Docker not starting** → Check ports and permissions
3. **Extensions not working** → Reload VS Code window
4. **Permission denied** → Run `./scripts/fix-permissions.sh`

### **Resources:**
- 📖 [Playwright Documentation](https://playwright.dev/)
- 📖 [Applitools Documentation](https://applitools.com/docs/)
- 📖 [VS Code Documentation](https://code.visualstudio.com/docs)
- 📖 [Docker Documentation](https://docs.docker.com/)

---

## 🎉 Success Checklist

- ✅ VS Code extensions installed
- ✅ Dependencies installed (`npm install`)
- ✅ Playwright browsers installed (`npx playwright install`)
- ✅ Docker running
- ✅ Git configured
- ✅ Project opens in VS Code
- ✅ Tests run successfully (`npm run test:api`)
- ✅ Reports generate (`npm run report`)

**🎊 Chúc mừng! Development environment của bạn đã sẵn sàng!**

---

*Generated by IDE Setup Script - Last updated: $(date)*
