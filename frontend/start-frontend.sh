#!/bin/bash

# Start Script for Frontend Only
# Use this when backend is already running in another terminal

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

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FRONTEND_DIR="$SCRIPT_DIR"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Starting Frontend (Backend should be running) ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}\n"

# Check if npm is available
if ! command -v npm >/dev/null 2>&1 || ! npm --version >/dev/null 2>&1; then
    print_error "npm is not working. Please run ./repair-npm.sh first"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    print_warning "Dependencies not installed. Running npm install..."
    cd "$FRONTEND_DIR"
    npm install || {
        print_error "Failed to install dependencies"
        exit 1
    }
else
    print_success "Dependencies are installed"
fi

# Check if backend is running
print_info "Checking if backend is accessible..."
if curl -s http://localhost:8000/api/health >/dev/null 2>&1; then
    print_success "Backend is running and accessible at http://localhost:8000"
else
    print_warning "Backend may not be running or accessible"
    print_info "Make sure backend is running in another terminal:"
    echo "    cd /path/to/project"
    echo "    export OPENAI_API_KEY=sk-..."
    echo "    uv run uvicorn api.index:app --reload"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to exit and start backend..."
fi

# Start frontend
print_info "Starting frontend development server..."
cd "$FRONTEND_DIR"

print_success "\nStarting frontend..."
echo ""
print_info "Frontend will be available at: http://localhost:3000"
print_info "Backend should be running at:  http://localhost:8000"
echo ""
print_info "Press Ctrl+C to stop the frontend server"
echo ""

# Start the dev server (this blocks, so it's fine)
npm run dev

