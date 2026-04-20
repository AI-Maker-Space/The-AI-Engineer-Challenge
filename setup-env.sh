#!/bin/bash

# Setup .env file for OpenAI API Key
# This script creates a .env file in the project root

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Get project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"
ENV_FILE="$PROJECT_ROOT/.env"

# Flush output immediately
exec 1>&2

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Setup .env File for OpenAI API Key${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if .env already exists
if [ -f "$ENV_FILE" ]; then
    print_warning ".env file already exists"
    echo ""
    printf "Do you want to update it? (y/n): "
    read -r update_env
    echo ""
    
    if [[ ! "$update_env" =~ ^[Yy]$ ]]; then
        print_info "Keeping existing .env file"
        exit 0
    fi
fi

# Get API key from user
print_info "Enter your OpenAI API key"
print_info "You can get it from: https://platform.openai.com/api-keys"
echo ""
printf "OpenAI API Key: "
read -r api_key
echo ""

if [ -z "$api_key" ]; then
    print_error "API key cannot be empty"
    exit 1
fi

# Validate API key format (starts with sk-)
if [[ ! "$api_key" =~ ^sk- ]]; then
    print_warning "API key doesn't start with 'sk-'. Continue anyway? (y/n)"
    printf "Continue: "
    read -r continue_key
    echo ""
    if [[ ! "$continue_key" =~ ^[Yy]$ ]]; then
        print_info "Setup cancelled"
        exit 0
    fi
fi

# Create .env file
cat > "$ENV_FILE" << EOF
# OpenAI API Key Configuration
# This file is gitignored for security - your API key will not be committed
# Location: Project root (where backend's load_dotenv() looks for it)

OPENAI_API_KEY=$api_key
EOF

# Set restrictive permissions
chmod 600 "$ENV_FILE"

print_success ".env file created at: $ENV_FILE"
print_info "File permissions set to 600 (owner read/write only)"
echo ""
print_success "You're all set! You can now run ./start.sh"
echo ""

