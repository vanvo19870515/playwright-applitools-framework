#!/bin/bash

# API Tests Runner Script
# This script provides various options for running API tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to run smoke tests
run_smoke_tests() {
    print_info "Running API smoke tests..."
    cd "$PROJECT_ROOT"
    npx playwright test --config=api-tests/playwright.config.ts --grep="CRITICAL"
}

# Function to run all API tests
run_all_tests() {
    print_info "Running all API tests..."
    cd "$PROJECT_ROOT"
    npx playwright test --config=api-tests/playwright.config.ts
}

# Function to run specific test file
run_specific_test() {
    local test_file=$1
    if [ -z "$test_file" ]; then
        print_error "Please specify a test file. Usage: $0 specific <test-file>"
        exit 1
    fi

    print_info "Running specific test: $test_file"
    cd "$PROJECT_ROOT"
    npx playwright test --config=api-tests/playwright.config.ts "$test_file"
}

# Function to run tests with specific tag
run_tagged_tests() {
    local tag=$1
    if [ -z "$tag" ]; then
        print_error "Please specify a tag. Usage: $0 tagged <tag>"
        exit 1
    fi

    print_info "Running tests with tag: $tag"
    cd "$PROJECT_ROOT"
    npx playwright test --config=api-tests/playwright.config.ts --grep="$tag"
}

# Function to run tests in headed mode for debugging
run_headed_tests() {
    print_info "Running API tests in headed mode..."
    cd "$PROJECT_ROOT"
    npx playwright test --config=api-tests/playwright.config.ts --headed
}

# Function to generate test report
generate_report() {
    print_info "Generating test report..."
    cd "$PROJECT_ROOT"
    npx allure serve allure-results
}

# Function to run tests with coverage
run_with_coverage() {
    print_info "Running tests with coverage..."
    cd "$PROJECT_ROOT"
    # Note: Playwright doesn't have built-in coverage, but you can use nyc for JavaScript coverage
    npx playwright test --config=api-tests/playwright.config.ts
}

# Function to show help
show_help() {
    echo "API Tests Runner"
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  smoke          Run critical smoke tests"
    echo "  all            Run all API tests"
    echo "  specific       Run specific test file"
    echo "  tagged         Run tests with specific tag"
    echo "  headed         Run tests in headed mode (for debugging)"
    echo "  report         Generate and serve test report"
    echo "  coverage       Run tests with coverage"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 smoke"
    echo "  $0 all"
    echo "  $0 specific auth-api.spec.ts"
    echo "  $0 tagged auth"
    echo "  $0 headed"
    echo "  $0 report"
}

# Main script logic
case "${1:-all}" in
    smoke)
        check_docker
        run_smoke_tests
        ;;
    all)
        check_docker
        run_all_tests
        ;;
    specific)
        check_docker
        run_specific_test "$2"
        ;;
    tagged)
        check_docker
        run_tagged_tests "$2"
        ;;
    headed)
        check_docker
        run_headed_tests
        ;;
    report)
        generate_report
        ;;
    coverage)
        check_docker
        run_with_coverage
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
