#!/bin/bash

# Permanent npm Fix Script
# This script provides a robust, permanent solution to fix npm issues
# It uses Homebrew to properly install and manage Node.js and npm

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}${BOLD}$1${NC}"
    echo -e "${BLUE}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

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

print_header "Permanent npm Fix Script"
print_info "This script will permanently fix npm by installing Node.js via Homebrew"
echo ""

# Check if Homebrew is available
if ! command -v brew >/dev/null 2>&1; then
    print_error "Homebrew is not found in PATH"
    print_info "Trying to find Homebrew..."
    
    # Check common Homebrew locations
    if [ -f "/opt/homebrew/bin/brew" ]; then
        export PATH="/opt/homebrew/bin:$PATH"
        print_success "Found Homebrew at /opt/homebrew/bin/brew"
    elif [ -f "/usr/local/bin/brew" ]; then
        export PATH="/usr/local/bin:$PATH"
        print_success "Found Homebrew at /usr/local/bin/brew"
    else
        print_error "Homebrew not found. Installing Homebrew first..."
        print_info "Please install Homebrew from: https://brew.sh"
        print_info "Or run: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
fi

BREW_VERSION=$(brew --version | head -1)
print_success "Homebrew is available: $BREW_VERSION"

# Check current Node.js installation
print_header "Checking Current Installation"
if command -v node >/dev/null 2>&1; then
    CURRENT_NODE=$(node --version 2>/dev/null || echo "unknown")
    CURRENT_PATH=$(which node)
    print_info "Current Node.js: $CURRENT_NODE at $CURRENT_PATH"
else
    print_warning "Node.js not found in PATH"
fi

# Check if npm works
NPM_WORKS=false
if command -v npm >/dev/null 2>&1; then
    if npm --version >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_success "npm is working: v$NPM_VERSION"
        NPM_WORKS=true
    else
        print_warning "npm command exists but doesn't work"
    fi
else
    print_warning "npm not found in PATH"
fi

# Determine the fix strategy
print_header "Fix Strategy"

if [ "$NPM_WORKS" = true ]; then
    print_success "npm is already working! No fix needed."
    exit 0
fi

print_info "Strategy: Install Node.js via Homebrew"
print_info "This will provide a clean, properly managed installation"
echo ""

# Ask for confirmation
read -p "Do you want to proceed with Homebrew installation? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Installation cancelled"
    exit 1
fi

# Install Node.js via Homebrew
print_header "Installing Node.js via Homebrew"
print_info "This will install the latest LTS version of Node.js (includes npm)"

if brew install node; then
    print_success "Node.js installed successfully via Homebrew"
else
    print_error "Failed to install Node.js via Homebrew"
    print_info "You may need to run: brew install node"
    exit 1
fi

# Update PATH for this session
print_header "Updating PATH"
if [ -d "/opt/homebrew/bin" ]; then
    export PATH="/opt/homebrew/bin:$PATH"
    print_success "Added /opt/homebrew/bin to PATH"
elif [ -d "/usr/local/bin" ]; then
    export PATH="/usr/local/bin:$PATH"
    print_success "Added /usr/local/bin to PATH"
fi

# Reload shell configuration
if [ -f ~/.zshrc ]; then
    source ~/.zshrc 2>/dev/null || true
elif [ -f ~/.bash_profile ]; then
    source ~/.bash_profile 2>/dev/null || true
elif [ -f ~/.bashrc ]; then
    source ~/.bashrc 2>/dev/null || true
fi

# Verify installation
print_header "Verifying Installation"

sleep 1

if command -v node >/dev/null 2>&1; then
    NEW_NODE_VERSION=$(node --version)
    NEW_NODE_PATH=$(which node)
    print_success "Node.js: $NEW_NODE_VERSION at $NEW_NODE_PATH"
else
    print_warning "Node.js not found in PATH - you may need to restart your terminal"
fi

if command -v npm >/dev/null 2>&1 && npm --version >/dev/null 2>&1; then
    NEW_NPM_VERSION=$(npm --version)
    NEW_NPM_PATH=$(which npm)
    print_success "npm: v$NEW_NPM_VERSION at $NEW_NPM_PATH"
    
    # Test npm
    print_info "Testing npm with a simple command..."
    if npm --version >/dev/null 2>&1; then
        print_success "npm is working correctly!"
    fi
else
    print_warning "npm not found - you may need to restart your terminal"
    print_info "Or run: export PATH=\"/opt/homebrew/bin:\$PATH\" (ARM Mac)"
    print_info "Or run: export PATH=\"/usr/local/bin:\$PATH\" (Intel Mac)"
fi

# Update shell configuration files permanently
print_header "Making PATH Changes Permanent"

SHELL_CONFIG=""
if [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    if [ -f "$HOME/.bash_profile" ]; then
        SHELL_CONFIG="$HOME/.bash_profile"
    else
        SHELL_CONFIG="$HOME/.bashrc"
    fi
fi

if [ -n "$SHELL_CONFIG" ]; then
    print_info "Updating $SHELL_CONFIG"
    
    # Determine Homebrew prefix
    if [ -d "/opt/homebrew" ]; then
        HOMEBREW_PREFIX="/opt/homebrew"
    elif [ -d "/usr/local" ]; then
        HOMEBREW_PREFIX="/usr/local"
    else
        HOMEBREW_PREFIX=""
    fi
    
    if [ -n "$HOMEBREW_PREFIX" ]; then
        # Check if PATH already includes Homebrew
        if ! grep -q "$HOMEBREW_PREFIX/bin" "$SHELL_CONFIG" 2>/dev/null; then
            echo "" >> "$SHELL_CONFIG"
            echo "# Homebrew PATH (added by npm fix script)" >> "$SHELL_CONFIG"
            echo "export PATH=\"$HOMEBREW_PREFIX/bin:\$PATH\"" >> "$SHELL_CONFIG"
            print_success "Added Homebrew to PATH in $SHELL_CONFIG"
        else
            print_info "Homebrew already in PATH in $SHELL_CONFIG"
        fi
    fi
else
    print_warning "Could not determine shell config file"
    print_info "You may need to manually add Homebrew to your PATH"
fi

# Final summary
print_header "Installation Complete"

echo ""
print_success "Node.js and npm have been installed via Homebrew"
echo ""
print_info "Next steps:"
echo ""
echo "  1. ${BOLD}Restart your terminal${NC} (or run: source $SHELL_CONFIG)"
echo "  2. Verify installation:"
echo "     node --version"
echo "     npm --version"
echo "  3. Run the frontend setup:"
echo "     cd frontend"
echo "     ./setup.sh"
echo ""
print_warning "Note: You may need to restart your terminal for PATH changes to take effect"
echo ""

