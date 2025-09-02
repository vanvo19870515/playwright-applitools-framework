#!/bin/bash

# ========================================
# START N8N WORKFLOW AUTOMATION
# ========================================

set -e

echo "🚀 Starting n8n Workflow Automation..."

# Check if n8n is already running
if docker-compose ps | grep -q "n8n"; then
    echo "ℹ️  n8n is already running!"
    echo "🌐 Access at: http://localhost:5678"
    echo "   Username: admin"
    echo "   Password: admin123"
    exit 0
fi

# Start n8n with dependencies
echo "📦 Starting n8n with PostgreSQL and Redis..."
docker-compose --profile workflow up -d

echo "⏳ Waiting for n8n to be ready..."
sleep 15

# Check if n8n is healthy
if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
    echo "✅ n8n is ready!"
    echo ""
    echo "🌐 Access n8n at: http://localhost:5678"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "💡 Quick commands:"
    echo "   Stop n8n:     docker-compose --profile workflow down"
    echo "   View logs:    docker-compose logs -f n8n"
    echo "   Reset data:   docker-compose --profile workflow down -v"
else
    echo "❌ n8n is not ready yet. Checking logs..."
    docker-compose logs n8n
fi
