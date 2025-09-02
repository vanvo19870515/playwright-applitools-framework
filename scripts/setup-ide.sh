#!/bin/bash

# IDE Setup Script for Playwright + Applitools Framework
# This script sets up all necessary tools and configurations for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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

print_step() {
    echo -e "${CYAN}🚀 $1${NC}"
}

print_header() {
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}🎯 $1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install VS Code extensions
install_vscode_extensions() {
    print_step "Installing VS Code Extensions..."

    if ! command_exists code; then
        print_error "VS Code CLI not found. Please install VS Code and add 'code' to PATH"
        print_info "Download from: https://code.visualstudio.com/download"
        return 1
    fi

    # List of essential extensions
    extensions=(
        "ms-vscode.vscode-typescript-next"
        "esbenp.prettier-vscode"
        "ms-vscode.vscode-eslint"
        "ms-playwright.playwright"
        "ms-azuretools.vscode-docker"
        "eamodio.gitlens"
        "christian-kohler.path-intellisense"
        "ms-vscode.vscode-json"
        "redhat.vscode-yaml"
        "humao.rest-client"
        "ms-vscode.vscode-icons"
        "bradlc.vscode-tailwindcss"
        "docsmsft.docs-markdown"
    )

    for ext in "${extensions[@]}"; do
        print_info "Installing extension: $ext"
        if code --install-extension "$ext" --force; then
            print_success "✓ $ext installed"
        else
            print_warning "⚠️  Failed to install $ext"
        fi
    done

    print_success "VS Code extensions installation completed!"
}

# Function to setup project dependencies
setup_dependencies() {
    print_step "Setting up project dependencies..."

    # Install npm dependencies
    if command_exists npm; then
        print_info "Installing npm dependencies..."
        npm install
        print_success "npm dependencies installed"
    else
        print_error "npm not found. Please install Node.js first"
        return 1
    fi

    # Install Playwright browsers
    if command_exists npx; then
        print_info "Installing Playwright browsers..."
        npx playwright install
        print_success "Playwright browsers installed"
    fi

    print_success "Project dependencies setup completed!"
}

# Function to check and setup Docker
setup_docker() {
    print_step "Checking Docker setup..."

    if command_exists docker && command_exists docker-compose; then
        print_info "Docker is already installed"
        docker --version
        docker-compose --version

        # Test Docker
        if docker info >/dev/null 2>&1; then
            print_success "Docker is running"
        else
            print_warning "Docker is installed but not running. Please start Docker Desktop"
        fi
    else
        print_warning "Docker not found. Please install Docker Desktop:"
        print_info "Download from: https://www.docker.com/products/docker-desktop"
    fi
}

# Function to setup Git
setup_git() {
    print_step "Checking Git setup..."

    if command_exists git; then
        print_info "Git is installed:"
        git --version

        # Configure Git if needed
        if [[ -z "$(git config --global user.name)" ]]; then
            print_warning "Git user name not configured"
            print_info "Run: git config --global user.name \"Your Name\""
        fi

        if [[ -z "$(git config --global user.email)" ]]; then
            print_warning "Git user email not configured"
            print_info "Run: git config --global user.email \"your.email@example.com\""
        fi
    else
        print_error "Git not found. Please install Git"
        print_info "Download from: https://git-scm.com/downloads"
    fi
}

# Function to setup development tools
setup_dev_tools() {
    print_step "Setting up development tools..."

    # Check Node.js version
    if command_exists node; then
        print_info "Node.js version: $(node --version)"
    else
        print_warning "Node.js not found. Please install Node.js 18+"
        print_info "Download from: https://nodejs.org/"
    fi

    # Check npm version
    if command_exists npm; then
        print_info "npm version: $(npm --version)"
    fi

    # Check if we're in the correct directory
    if [[ ! -f "package.json" ]]; then
        print_error "Not in project root directory. Please run this script from the project root."
        return 1
    fi

    print_success "Development tools check completed!"
}

# Function to create VS Code workspace settings
setup_vscode_workspace() {
    print_step "Setting up VS Code workspace..."

    # Create .vscode directory if it doesn't exist
    mkdir -p .vscode

    # Check if settings files exist
    if [[ -f ".vscode/settings.json" ]]; then
        print_success "VS Code settings.json exists"
    else
        print_warning "VS Code settings.json not found"
    fi

    if [[ -f ".vscode/extensions.json" ]]; then
        print_success "VS Code extensions.json exists"
    else
        print_warning "VS Code extensions.json not found"
    fi

    if [[ -f ".vscode/launch.json" ]]; then
        print_success "VS Code launch.json exists"
    else
        print_warning "VS Code launch.json not found"
    fi

    if [[ -f ".vscode/tasks.json" ]]; then
        print_success "VS Code tasks.json exists"
    else
        print_warning "VS Code tasks.json not found"
    fi

    print_success "VS Code workspace setup completed!"
}

# Function to run test setup
run_initial_tests() {
    print_step "Running initial test setup..."

    # Check if we can run basic commands
    print_info "Testing basic npm commands..."
    npm --version >/dev/null 2>&1 && print_success "npm works" || print_error "npm not working"

    print_info "Testing basic Playwright commands..."
    npx playwright --version >/dev/null 2>&1 && print_success "Playwright works" || print_error "Playwright not working"

    # Run a simple test to verify setup
    print_info "Running smoke test..."
    if npm run test:api --silent 2>/dev/null | grep -q "passed\|failed\|error"; then
        print_success "API tests are executable"
    else
        print_warning "API tests may need configuration"
    fi

    print_success "Initial test setup completed!"
}

# Function to show usage
show_usage() {
    echo "IDE Setup Script for Playwright + Applitools Framework"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --all          Setup everything (default)"
    echo "  --vscode       Setup VS Code only"
    echo "  --deps         Setup dependencies only"
    echo "  --docker       Setup Docker only"
    echo "  --git          Setup Git only"
    echo "  --dev-tools    Setup development tools only"
    echo "  --test         Run initial tests only"
    echo "  --help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Setup everything"
    echo "  $0 --vscode     # Setup VS Code only"
    echo "  $0 --deps       # Setup dependencies only"
}

# Main function
main() {
    print_header "🎯 PLAYWRIGHT + APPLITOOLS FRAMEWORK - IDE SETUP"
    echo ""

    case "${1:-}" in
        --all|"")
            print_info "Starting complete IDE setup..."
            setup_dev_tools
            setup_git
            setup_docker
            setup_dependencies
            install_vscode_extensions
            setup_vscode_workspace
            run_initial_tests
            ;;
        --vscode)
            install_vscode_extensions
            setup_vscode_workspace
            ;;
        --deps)
            setup_dependencies
            ;;
        --docker)
            setup_docker
            ;;
        --git)
            setup_git
            ;;
        --dev-tools)
            setup_dev_tools
            ;;
        --test)
            run_initial_tests
            ;;
        --help|-h)
            show_usage
            return 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo ""
            show_usage
            return 1
            ;;
    esac

    echo ""
    print_header "🎉 SETUP COMPLETED!"
    echo ""
    print_success "Your development environment is now ready!"
    echo ""
    print_info "Next steps:"
    echo "  1. Open the project in VS Code: code ."
    echo "  2. Install recommended extensions when prompted"
    echo "  3. Run tests: npm run test:api"
    echo "  4. View reports: npm run report"
    echo ""
    print_info "Useful commands:"
    echo "  • npm run test:api     - Run API tests"
    echo "  • npm run test:ui      - Run UI tests"
    echo "  • npm run report       - View test reports"
    echo "  • ./scripts/start-all.sh - Start all services"
    echo ""
    print_info "Happy coding! 🚀"
}

# Run main function with all arguments
main "$@"
