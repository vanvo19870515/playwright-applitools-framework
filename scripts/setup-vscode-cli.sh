#!/bin/bash

# Setup VS Code CLI Script
# This script helps configure VS Code CLI after installation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

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

print_header() {
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}🎯 $1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to check if VS Code is installed
check_vscode_installed() {
    print_info "Checking if VS Code is installed..."

    if [[ -d "/Applications/Visual Studio Code.app" ]]; then
        print_success "VS Code is installed at /Applications/Visual Studio Code.app"
        return 0
    elif [[ -d "$HOME/Applications/Visual Studio Code.app" ]]; then
        print_success "VS Code is installed at $HOME/Applications/Visual Studio Code.app"
        return 0
    else
        print_warning "VS Code application not found"
        return 1
    fi
}

# Function to find VS Code executable
find_vscode_executable() {
    if [[ -f "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" ]]; then
        echo "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
    elif [[ -f "$HOME/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" ]]; then
        echo "$HOME/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
    else
        echo ""
    fi
}

# Function to setup VS Code CLI
setup_vscode_cli() {
    print_info "Setting up VS Code CLI..."

    VSCODE_PATH=$(find_vscode_executable)

    if [[ -z "$VSCODE_PATH" ]]; then
        print_error "VS Code executable not found"
        return 1
    fi

    print_info "Found VS Code at: $VSCODE_PATH"

    # Create symlink in /usr/local/bin
    if [[ -w "/usr/local/bin" ]]; then
        print_info "Creating symlink in /usr/local/bin..."
        sudo ln -sf "$VSCODE_PATH" /usr/local/bin/code
        print_success "VS Code CLI installed at /usr/local/bin/code"
    else
        print_warning "/usr/local/bin is not writable, trying user bin directory..."

        # Try to add to user PATH
        USER_BIN="$HOME/bin"
        mkdir -p "$USER_BIN"

        ln -sf "$VSCODE_PATH" "$USER_BIN/code"
        print_success "VS Code CLI installed at $USER_BIN/code"

        # Check if user bin is in PATH
        if [[ ":$PATH:" != *":$USER_BIN:"* ]]; then
            print_warning "$USER_BIN is not in your PATH"
            print_info "Add this line to your ~/.zshrc or ~/.bash_profile:"
            echo "export PATH=\"$USER_BIN:\$PATH\""
        fi
    fi
}

# Function to test VS Code CLI
test_vscode_cli() {
    print_info "Testing VS Code CLI..."

    if command -v code >/dev/null 2>&1; then
        print_success "VS Code CLI is available"
        code --version
    else
        print_error "VS Code CLI is not available in PATH"
        print_info "Try restarting your terminal or run: source ~/.zshrc"
        return 1
    fi
}

# Function to install extensions
install_extensions() {
    print_info "Installing recommended VS Code extensions..."

    if ! command -v code >/dev/null 2>&1; then
        print_error "VS Code CLI not available, cannot install extensions"
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
    )

    for ext in "${extensions[@]}"; do
        print_info "Installing extension: $ext"
        if code --install-extension "$ext" --force; then
            print_success "✓ $ext installed"
        else
            print_warning "⚠️  Failed to install $ext"
        fi
    done

    print_success "Extensions installation completed!"
}

# Function to open project in VS Code
open_project() {
    print_info "Opening project in VS Code..."

    if command -v code >/dev/null 2>&1; then
        code .
        print_success "Project opened in VS Code"
    else
        print_error "VS Code CLI not available"
        print_info "Please manually open VS Code and open this project folder"
    fi
}

# Function to show next steps
show_next_steps() {
    echo ""
    print_header "🎉 NEXT STEPS"
    echo ""
    print_info "1. Open VS Code (if not already open)"
    print_info "2. You should see a popup asking to install recommended extensions"
    print_info "3. Click 'Install All' to install project extensions"
    echo ""
    print_info "4. Test the setup:"
    echo "   • npm run test:api     # Run API tests"
    echo "   • npm run test:ui      # Run UI tests"
    echo "   • npm run report       # View test reports"
    echo ""
    print_info "5. Useful VS Code commands:"
    echo "   • Ctrl+Shift+P → 'Playwright: Run Test' (to run individual tests)"
    echo "   • Ctrl+Shift+P → 'Tasks: Run Task' (to run project tasks)"
    echo "   • Ctrl+Shift+P → 'Debug: Start Debugging' (to debug tests)"
    echo ""
    print_info "Happy coding! 🚀"
}

# Main function
main() {
    print_header "🎯 VS CODE CLI SETUP"

    if ! check_vscode_installed; then
        print_error "VS Code is not installed yet!"
        echo ""
        print_info "Please follow these steps:"
        echo "1. Download VS Code from: https://code.visualstudio.com/download"
        echo "2. Install the .dmg file"
        echo "3. Run this script again: ./scripts/setup-vscode-cli.sh"
        exit 1
    fi

    setup_vscode_cli

    if test_vscode_cli; then
        install_extensions
        open_project
    fi

    show_next_steps
}

# Run main function
main "$@"
