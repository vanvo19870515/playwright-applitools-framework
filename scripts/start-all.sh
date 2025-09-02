#!/bin/bash

# ========================================
# QA AUTOMATION SUITE - START ALL SERVICES
# ========================================

set -e

echo "🚀 Starting QA Automation Suite..."

# Create necessary directories
mkdir -p test-results allure-results playwright-report workflows

# Start all services
echo "📦 Starting all services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check n8n
if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
    echo "✅ n8n is running at http://localhost:5678"
    echo "   Username: admin"
    echo "   Password: admin123"
else
    echo "❌ n8n is not ready yet"
fi

# Check Allure (if running)
if curl -f http://localhost:5050 > /dev/null 2>&1; then
    echo "✅ Allure Server is running at http://localhost:5050"
else
    echo "ℹ️  Allure Server not started (use --profile reporting)"
fi

# Check Grafana (if running)
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Grafana is running at http://localhost:3000"
    echo "   Username: admin"
    echo "   Password: admin123"
else
    echo "ℹ️  Grafana not started (use --profile monitoring)"
fi

echo ""
echo "🎯 Available services:"
echo "   🌐 n8n Workflow:     http://localhost:5678"
echo "   📊 Allure Reports:  http://localhost:5050"
echo "   📈 Grafana:         http://localhost:3000"
echo "   🔍 Prometheus:      http://localhost:9090"
echo ""
echo "💡 Quick commands:"
echo "   Run tests:     ./scripts/run-tests.sh"
echo "   Stop all:      ./scripts/stop-all.sh"
echo "   View logs:     ./scripts/logs.sh"
echo ""
echo "🎉 QA Automation Suite is ready!"
