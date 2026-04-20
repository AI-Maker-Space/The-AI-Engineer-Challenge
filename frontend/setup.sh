#!/bin/bash

# Setup script for AI Engineer Challenge Frontend
# This script checks dependencies, repairs npm if needed, and sets up the project

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored messages
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js installation
check_node() {
    print_header "Checking Node.js Installation"
    
    if command_exists node; then
        NODE_VERSION=$(node --version 2>/dev/null || echo "unknown")
        print_success "Node.js is installed: $NODE_VERSION"
        
        # Check if version is >= 18
        NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
        if [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
            print_success "Node.js version is compatible (>= 18)"
            return 0
        else
            print_warning "Node.js version $NODE_VERSION is less than 18"
            print_info "Consider upgrading to Node.js 18 or later"
            return 1
        fi
    else
        print_error "Node.js is not installed"
        return 1
    fi
}

# Check and repair npm
check_and_repair_npm() {
    print_header "Checking npm Installation"
    
    if command_exists npm; then
        # Test if npm actually works
        if npm --version >/dev/null 2>&1; then
            NPM_VERSION=$(npm --version)
            print_success "npm is working: v$NPM_VERSION"
            return 0
        else
            print_warning "npm command exists but is not working"
        fi
    else
        print_warning "npm is not in PATH"
    fi
    
    # Try to repair npm
    print_info "Attempting to repair npm..."
    
    # Check if we're using nvm
    if [ -d "$HOME/.nvm" ]; then
        print_info "Found nvm installation"
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        
        # Get current node version
        if command_exists node; then
            NODE_VERSION=$(node --version)
            print_info "Current Node.js version: $NODE_VERSION"
            
            # Reinstall npm for current node version
            print_info "Reinstalling npm for Node.js $NODE_VERSION..."
            if curl -fsSL https://www.npmjs.com/install.sh | sh >/dev/null 2>&1; then
                print_success "npm reinstalled successfully"
                return 0
            fi
        fi
    fi
    
    # Try using node to install npm
    if command_exists node; then
        print_info "Attempting to install npm using Node.js..."
        
        # Try installing npm via node's built-in method
        NODE_PATH=$(which node)
        NPM_PATH=$(dirname $NODE_PATH)/npm
        
        if [ -f "$NPM_PATH" ]; then
            # Try running npm directly
            if $NPM_PATH --version >/dev/null 2>&1; then
                print_success "Found working npm at: $NPM_PATH"
                return 0
            fi
        fi
    fi
    
    # If we can't repair, provide instructions
    print_error "Could not automatically repair npm"
    print_info "Please try one of the following:"
    echo ""
    echo "  1. Reinstall Node.js (includes npm):"
    echo "     Visit: https://nodejs.org/"
    echo ""
    echo "  2. Use nvm to reinstall Node.js:"
    echo "     nvm install 18"
    echo "     nvm use 18"
    echo ""
    echo "  3. Manually install npm:"
    echo "     curl -fsSL https://www.npmjs.com/install.sh | sh"
    echo ""
    
    return 1
}

# Install dependencies
install_dependencies() {
    print_header "Installing Frontend Dependencies"
    
    # Get the script's directory
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    cd "$SCRIPT_DIR"
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in frontend directory"
        return 1
    fi
    
    print_info "Running npm install..."
    
    if npm install; then
        print_success "Dependencies installed successfully"
        return 0
    else
        print_error "Failed to install dependencies"
        print_info "You may need to run 'npm install' manually"
        return 1
    fi
}

# Check backend setup
check_backend() {
    print_header "Checking Backend Setup"
    
    # Check if we're in the project root or frontend directory
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    PROJECT_ROOT=$(dirname "$SCRIPT_DIR")
    
    if [ -f "$PROJECT_ROOT/api/index.py" ]; then
        print_success "Backend API found at $PROJECT_ROOT/api/index.py"
        
        # Check if OPENAI_API_KEY is set
        if [ -z "$OPENAI_API_KEY" ]; then
            print_warning "OPENAI_API_KEY environment variable is not set"
            print_info "You'll need to set it before starting the backend:"
            echo "    export OPENAI_API_KEY=sk-..."
        else
            print_success "OPENAI_API_KEY is set"
        fi
        
        # Check if uv is available
        if command_exists uv; then
            print_success "uv package manager is available"
        else
            print_warning "uv is not installed"
            print_info "Install with: pip install uv"
        fi
        
        return 0
    else
        print_warning "Backend API not found at expected location"
        return 1
    fi
}

# Main setup function
main() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════╗"
    echo "║  AI Engineer Challenge - Frontend Setup       ║"
    echo "╚════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Track if we encountered any issues
    ISSUES=0
    
    # Check Node.js
    if ! check_node; then
        ISSUES=$((ISSUES + 1))
    fi
    
    # Check and repair npm
    if ! check_and_repair_npm; then
        ISSUES=$((ISSUES + 1))
    fi
    
    # If npm is working, install dependencies
    if npm --version >/dev/null 2>&1; then
        if ! install_dependencies; then
            ISSUES=$((ISSUES + 1))
        fi
    else
        print_warning "Skipping dependency installation (npm not working)"
        ISSUES=$((ISSUES + 1))
    fi
    
    # Check backend
    check_backend
    
    # Summary
    print_header "Setup Summary"
    
    if [ $ISSUES -eq 0 ]; then
        print_success "All checks passed! Your frontend is ready to run."
        echo ""
        print_info "To start the development server, run:"
        echo "    cd frontend"
        echo "    npm run dev"
        echo ""
        print_info "To start the backend, run (from project root):"
        echo "    export OPENAI_API_KEY=sk-..."
        echo "    uv run uvicorn api.index:app --reload"
    else
        print_warning "Encountered $ISSUES issue(s) during setup"
        echo ""
        print_info "Please resolve the issues above and run this script again"
        echo "or follow the manual setup instructions in frontend/README.md"
    fi
    
    echo ""
}

# Run main function
main

