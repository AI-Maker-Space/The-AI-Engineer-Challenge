#!/bin/bash

# Start Script for AI Engineer Challenge
# Starts both frontend and backend servers

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
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")
FRONTEND_DIR="$SCRIPT_DIR"
BACKEND_DIR="$PROJECT_ROOT"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Starting AI Engineer Challenge                 ║${NC}"
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
fi

# Check if uv is available for backend
if ! command -v uv >/dev/null 2>&1; then
    print_warning "uv is not installed. Backend cannot start."
    print_info "Install with: pip install uv"
    print_info "Or use start-frontend.sh if backend is already running in another terminal"
    exit 1
fi

# Check if OPENAI_API_KEY is set (only needed if starting backend)
if [ -z "$OPENAI_API_KEY" ]; then
    print_error "OPENAI_API_KEY is not set"
    print_info "This script starts the backend server, which requires an OpenAI API key."
    print_info "Please set it in your current terminal:"
    echo "    export OPENAI_API_KEY=sk-..."
    echo ""
    print_info "Alternatively, if your backend is already running, use:"
    echo "    ./start-frontend.sh"
    echo ""
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    print_info "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit
}

trap cleanup EXIT INT TERM

# Start backend
print_info "Starting backend server..."
cd "$BACKEND_DIR"
if command -v uv >/dev/null 2>&1; then
    uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
else
    print_error "uv not found. Please start backend manually:"
    echo "    cd $BACKEND_DIR"
    echo "    export OPENAI_API_KEY=sk-..."
    echo "    uv run uvicorn api.index:app --reload"
    BACKEND_PID=""
fi

# Wait a bit for backend to start
sleep 2

# Check if backend started successfully
if [ -n "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
    print_success "Backend started (PID: $BACKEND_PID)"
    print_info "Backend logs: tail -f /tmp/backend.log"
else
    print_warning "Backend may not have started. Check logs: tail -f /tmp/backend.log"
fi

# Start frontend
print_info "Starting frontend server..."
cd "$FRONTEND_DIR"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

sleep 2

if kill -0 $FRONTEND_PID 2>/dev/null; then
    print_success "Frontend started (PID: $FRONTEND_PID)"
    print_info "Frontend logs: tail -f /tmp/frontend.log"
else
    print_error "Frontend failed to start. Check logs: tail -f /tmp/frontend.log"
    exit 1
fi

print_success "\nBoth servers are starting!"
echo ""
print_info "Frontend: http://localhost:3000"
print_info "Backend:  http://localhost:8000"
echo ""
print_info "Logs:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
print_info "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
wait

