#!/bin/bash

# Fix File Permissions Script
# This script fixes file permissions to make files editable in IDE

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Function to check if running as sudo
check_permissions() {
    if [[ $EUID -eq 0 ]]; then
        print_warning "Running as root - this might cause permission issues later"
    fi
}

# Function to fix permissions for source files
fix_source_permissions() {
    print_info "Fixing permissions for source files..."

    # Fix TypeScript files
    find . -path "./node_modules" -prune -o -name "*.ts" -type f -exec chmod 644 {} \;
    find . -path "./node_modules" -prune -o -name "*.js" -type f -exec chmod 644 {} \;

    # Fix configuration files
    find . -path "./node_modules" -prune -o -name "*.json" -type f -exec chmod 644 {} \;
    find . -path "./node_modules" -prune -o -name "*.yml" -type f -exec chmod 644 {} \;
    find . -path "./node_modules" -prune -o -name "*.yaml" -type f -exec chmod 644 {} \;
    find . -path "./node_modules" -prune -o -name "*.md" -type f -exec chmod 644 {} \;

    # Fix shell scripts (make them executable)
    find . -path "./node_modules" -prune -o -name "*.sh" -type f -exec chmod 755 {} \;

    print_success "Source file permissions fixed!"
}

# Function to check for read-only files
check_readonly_files() {
    print_info "Checking for read-only files..."

    readonly_files=$(find . -path "./node_modules" -prune -o -type f \( -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "*.md" \) -perm 444 2>/dev/null)

    if [[ -n "$readonly_files" ]]; then
        print_warning "Found read-only files:"
        echo "$readonly_files"
        echo "$readonly_files" | xargs chmod 644
        print_success "Fixed read-only files!"
    else
        print_success "No read-only files found!"
    fi
}

# Function to verify permissions
verify_permissions() {
    print_info "Verifying file permissions..."

    # Check key files
    key_files=("package.json" "playwright.config.ts" "api-tests/playwright.config.ts")

    for file in "${key_files[@]}"; do
        if [[ -f "$file" ]]; then
            perms=$(ls -la "$file" | awk '{print $1}')
            if [[ "$perms" == "-rw-r--r--" ]]; then
                print_success "$file: $perms ✓"
            else
                print_warning "$file: $perms ⚠️"
            fi
        fi
    done
}

# Function to show usage
show_usage() {
    echo "Fix File Permissions Script"
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --check-only    Only check permissions without fixing"
    echo "  --help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              Fix all permissions"
    echo "  $0 --check-only Check permissions without fixing"
}

# Main script logic
main() {
    check_permissions

    case "${1:-}" in
        --check-only)
            check_readonly_files
            verify_permissions
            ;;
        --help|-h)
            show_usage
            ;;
        *)
            fix_source_permissions
            check_readonly_files
            verify_permissions
            print_success "All file permissions have been fixed!"
            echo ""
            print_info "You should now be able to edit files in your IDE"
            ;;
    esac
}

# Run main function
main "$@"
