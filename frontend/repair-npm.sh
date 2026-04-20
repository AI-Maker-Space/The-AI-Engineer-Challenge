#!/bin/bash

# npm Repair Script
# Attempts to repair a broken npm installation

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}npm Repair Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Method 1: Check if npm works after sourcing shell profile
print_info "Method 1: Checking npm in full shell environment..."

if [ -f ~/.zshrc ]; then
    source ~/.zshrc 2>/dev/null || true
elif [ -f ~/.bash_profile ]; then
    source ~/.bash_profile 2>/dev/null || true
elif [ -f ~/.bashrc ]; then
    source ~/.bashrc 2>/dev/null || true
fi

if command -v npm >/dev/null 2>&1 && npm --version >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_success "npm is working! Version: $NPM_VERSION"
    exit 0
fi

# Method 2: Try using npx (often more reliable)
print_info "Method 2: Checking if npx works..."
if command -v npx >/dev/null 2>&1 && npx --version >/dev/null 2>&1; then
    print_success "npx is working, can use it as npm alternative"
    print_info "You can use 'npx npm install' or install npm via npx"
fi

# Method 3: Try to reinstall npm using curl script
print_info "Method 3: Attempting to reinstall npm..."
if command -v curl >/dev/null 2>&1; then
    print_info "Downloading npm install script..."
    # Try with -k flag if SSL issues, or use wget as fallback
    if curl -kfsSL https://www.npmjs.com/install.sh 2>/dev/null | sh || \
       curl -fsSL https://www.npmjs.com/install.sh 2>/dev/null | sh; then
        # Reload shell to pick up new npm
        if [ -f ~/.zshrc ]; then source ~/.zshrc 2>/dev/null; fi
        if [ -f ~/.bash_profile ]; then source ~/.bash_profile 2>/dev/null; fi
        
        if command -v npm >/dev/null 2>&1 && npm --version >/dev/null 2>&1; then
            print_success "npm reinstalled successfully!"
            exit 0
        fi
    fi
fi

# Method 4: Use Node.js to install npm
print_info "Method 4: Attempting to install npm via Node.js..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_info "Found Node.js: $NODE_VERSION"
    
    # Try to install npm using node
    NODE_PATH=$(which node)
    NODE_DIR=$(dirname "$NODE_PATH")
    
    # Check if we can use node's corepack (Node 16.10+)
    if node -e "require('child_process').execSync('corepack enable', {stdio: 'inherit'})" 2>/dev/null; then
        print_success "Enabled corepack"
        if command -v npm >/dev/null 2>&1 && npm --version >/dev/null 2>&1; then
            print_success "npm is now available via corepack!"
            exit 0
        fi
    fi
fi

# Method 5: Try using corepack via node
if command -v node >/dev/null 2>&1; then
    print_info "Method 5: Attempting to use corepack (Node.js built-in)..."
    NODE_VERSION=$(node --version | sed 's/v//' | cut -d. -f1,2)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    NODE_MINOR=$(echo $NODE_VERSION | cut -d. -f2)
    
    # Corepack is available in Node 16.10+ but may need enabling
    if [ "$NODE_MAJOR" -ge 16 ] 2>/dev/null; then
        if [ "$NODE_MAJOR" -gt 16 ] || ([ "$NODE_MAJOR" -eq 16 ] && [ "$NODE_MINOR" -ge 10 ] 2>/dev/null); then
            # Enable corepack
            NODE_PATH=$(which node)
            COREPACK_PATH=$(dirname $NODE_PATH)/corepack
            
            if [ -f "$COREPACK_PATH" ]; then
                $COREPACK_PATH enable 2>/dev/null || node --experimental-corepack enable 2>/dev/null || true
                
                # Prepare npm via corepack
                if $COREPACK_PATH prepare npm@latest --activate 2>/dev/null || \
                   node --experimental-corepack prepare npm@latest --activate 2>/dev/null; then
                    # Reload shell
                    if [ -f ~/.zshrc ]; then source ~/.zshrc 2>/dev/null; fi
                    if [ -f ~/.bash_profile ]; then source ~/.bash_profile 2>/dev/null; fi
                    
                    if command -v npm >/dev/null 2>&1 && npm --version >/dev/null 2>&1; then
                        print_success "npm enabled via corepack!"
                        exit 0
                    fi
                fi
            fi
        fi
    fi
fi

# Method 6: Try using homebrew on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_info "Method 6: Checking Homebrew installation..."
    if command -v brew >/dev/null 2>&1; then
        print_info "Attempting to reinstall npm via Homebrew..."
        if brew reinstall npm 2>&1 | tail -20; then
            # Reload shell
            if [ -f ~/.zshrc ]; then source ~/.zshrc 2>/dev/null; fi
            if [ -f ~/.bash_profile ]; then source ~/.bash_profile 2>/dev/null; fi
            
            if command -v npm >/dev/null 2>&1 && npm --version >/dev/null 2>&1; then
                print_success "npm reinstalled via Homebrew!"
                exit 0
            fi
        fi
    fi
fi

# If all methods fail, provide manual instructions
print_error "Could not automatically repair npm"
echo ""
print_info "Manual repair options:"
echo ""
echo "  Option 1: Reinstall Node.js (Recommended)"
echo "    - Visit: https://nodejs.org/"
echo "    - Download and install the LTS version"
echo "    - This will include a working npm"
echo ""
echo "  Option 2: Use nvm (Node Version Manager)"
echo "    Install nvm:"
echo "      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
echo "    Then:"
echo "      nvm install 18"
echo "      nvm use 18"
echo ""
echo "  Option 3: Use corepack (Node.js built-in)"
echo "    corepack enable"
echo "    corepack prepare npm@latest --activate"
echo ""
echo "  Option 4: Use Homebrew (macOS)"
echo "    brew reinstall npm"
echo ""

exit 1

