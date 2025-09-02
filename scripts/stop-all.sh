#!/bin/bash

# ========================================
# QA AUTOMATION SUITE - STOP ALL SERVICES
# ========================================

set -e

echo "🛑 Stopping QA Automation Suite..."

# Stop all services
docker-compose down

# Optional: Clean up unused resources
read -p "🧹 Do you want to clean up unused Docker resources? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Cleaning up Docker resources..."
    docker system prune -f
    docker volume prune -f
    echo "✅ Cleanup completed!"
fi

echo "✅ All services stopped!"
