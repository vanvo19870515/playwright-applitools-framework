#!/bin/bash

# ========================================
# RUN PLAYWRIGHT TESTS
# ========================================

set -e

echo "🧪 Running Playwright Tests..."

# Check if test profile is running
if ! docker-compose ps | grep -q "playwright-runner"; then
    echo "📦 Starting test services..."
    docker-compose --profile test up -d
    echo "⏳ Waiting for services to be ready..."
    sleep 5
fi

# Run tests
echo "🚀 Executing tests..."
docker-compose run --rm playwright-runner npm test

echo "📊 Generating reports..."

# Generate Allure report
if docker-compose ps | grep -q "allure-server"; then
    echo "📈 Allure reports available at: http://localhost:5050"
fi

# Show test results
echo "📁 Test results available in:"
echo "   - test-results/"
echo "   - allure-results/"
echo "   - playwright-report/"

echo "✅ Tests completed!"
