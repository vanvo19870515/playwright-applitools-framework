#!/bin/bash

# ========================================
# VIEW QA AUTOMATION SUITE LOGS
# ========================================

set -e

echo "📋 QA Automation Suite Logs"

# Show available services
echo "Available services:"
echo "  1) All services"
echo "  2) Playwright Runner"
echo "  3) n8n Workflow"
echo "  4) Allure Server"
echo "  5) PostgreSQL"
echo "  6) Redis"
echo "  7) Prometheus"
echo "  8) Grafana"

read -p "Select service (1-8): " choice

case $choice in
    1)
        echo "📋 Showing logs for all services..."
        docker-compose logs -f
        ;;
    2)
        echo "📋 Showing Playwright Runner logs..."
        docker-compose logs -f playwright-runner
        ;;
    3)
        echo "📋 Showing n8n logs..."
        docker-compose logs -f n8n
        ;;
    4)
        echo "📋 Showing Allure Server logs..."
        docker-compose logs -f allure-server
        ;;
    5)
        echo "📋 Showing PostgreSQL logs..."
        docker-compose logs -f postgres
        ;;
    6)
        echo "📋 Showing Redis logs..."
        docker-compose logs -f redis
        ;;
    7)
        echo "📋 Showing Prometheus logs..."
        docker-compose logs -f prometheus
        ;;
    8)
        echo "📋 Showing Grafana logs..."
        docker-compose logs -f grafana
        ;;
    *)
        echo "❌ Invalid choice. Please select 1-8."
        exit 1
        ;;
esac
