# ========================================
# QA AUTOMATION SUITE MAKEFILE
# ========================================

.PHONY: help setup start stop restart logs clean test build deploy

# Default target
help: ## Show this help message
	@echo "🚀 QA Automation Suite Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

# Setup
setup: ## Initial setup - create .env file
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Created .env file from template"; \
		echo "⚠️  Please edit .env with your actual values"; \
	else \
		echo "ℹ️  .env file already exists"; \
	fi

# Docker commands
start: ## Start all services
	./scripts/start-all.sh

start-minimal: ## Start only essential services (n8n + postgres)
	docker-compose --profile workflow up -d

start-full: ## Start all services including monitoring
	docker-compose --profile workflow --profile monitoring up -d

stop: ## Stop all services
	./scripts/stop-all.sh

restart: ## Restart all services
	docker-compose restart

# Testing
test: ## Run all tests
	./scripts/run-tests.sh

test-debug: ## Run tests in debug mode
	docker-compose run --rm playwright-runner npx playwright test --debug

test-ui: ## Run tests with Playwright UI
	docker-compose run --rm playwright-runner npx playwright test --ui

test-chromium: ## Run tests only on Chromium
	docker-compose run --rm playwright-runner npx playwright test --project=chromium

test-headed: ## Run tests in headed mode (visible browser)
	docker-compose run --rm playwright-runner npx playwright test --headed

# Reporting
report: ## Generate and serve Allure report
	docker-compose --profile reporting up -d allure-server
	@echo "📊 Allure report available at: http://localhost:5050"

# Monitoring
monitor: ## Start monitoring stack
	docker-compose --profile monitoring up -d
	@echo "📈 Grafana: http://localhost:3000 (admin/admin123)"
	@echo "📊 Prometheus: http://localhost:9090"

# Logs
logs: ## Show logs for all services
	./scripts/logs.sh

logs-n8n: ## Show n8n logs
	docker-compose logs -f n8n

logs-test: ## Show test runner logs
	docker-compose logs -f playwright-runner

# Maintenance
build: ## Build all Docker images
	docker-compose build

clean: ## Clean up containers and volumes
	docker-compose down -v
	docker system prune -f
	docker volume prune -f

clean-all: ## Clean up everything including images
	docker-compose down --rmi all -v
	docker system prune -a -f
	docker volume prune -f

# Development
dev: ## Start development environment
	docker-compose -f docker-compose.dev.yml up -d

shell-n8n: ## Open shell in n8n container
	docker-compose exec n8n /bin/sh

shell-test: ## Open shell in test runner container
	docker-compose run --rm playwright-runner /bin/bash

# Deployment
deploy: ## Deploy to production (requires proper .env setup)
	@echo "🚀 Deploying to production..."
	docker-compose -f docker-compose.prod.yml up -d

# Health checks
health: ## Check health of all services
	@echo "🔍 Checking service health..."
	@docker-compose ps
	@echo ""
	@echo "🌐 Service URLs:"
	@echo "  n8n:         http://localhost:5678"
	@echo "  Allure:      http://localhost:5050"
	@echo "  Grafana:     http://localhost:3000"
	@echo "  Prometheus:  http://localhost:9090"

# Quick actions
workflow: ## Open n8n workflow editor
	@echo "🌐 Opening n8n at: http://localhost:5678"
	@if command -v open >/dev/null 2>&1; then \
		open http://localhost:5678; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open http://localhost:5678; \
	else \
		echo "Please open http://localhost:5678 in your browser"; \
	fi

dashboard: ## Open Grafana dashboard
	@echo "📈 Opening Grafana at: http://localhost:3000"
	@if command -v open >/dev/null 2>&1; then \
		open http://localhost:3000; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open http://localhost:3000; \
	else \
		echo "Please open http://localhost:3000 in your browser"; \
	fi

# Information
info: ## Show system information
	@echo "🖥️  System Information:"
	@echo "  Docker version: $$(docker --version)"
	@echo "  Docker Compose version: $$(docker-compose --version)"
	@echo "  Node version: $$(node --version 2>/dev/null || echo 'Not installed')"
	@echo "  npm version: $$(npm --version 2>/dev/null || echo 'Not installed')"
	@echo ""
	@echo "📁 Current directory: $$(pwd)"
	@echo "📁 Available services: $$(ls docker/ | grep Dockerfile | wc -l) Dockerfiles"
	@echo "🧪 Test files: $$(find tests -name "*.spec.ts" 2>/dev/null | wc -l || echo 0)"
	@echo "📄 Workflow files: $$(find workflows -name "*.json" 2>/dev/null | wc -l || echo 0)"
