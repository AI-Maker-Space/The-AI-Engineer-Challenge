#!/bin/bash

# Unified Start Script for AI Engineer Challenge
# Automatically starts backend if needed, then starts frontend

set -e

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}${BOLD}  AI Engineer Challenge - Starting Application${NC}"
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

# Get project root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT"

print_header

# Function to check if backend is running
check_backend() {
    if curl -s http://localhost:8000/api/health >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to wait for backend to be ready
wait_for_backend() {
    print_info "Waiting for backend to be ready..."
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if check_backend; then
            print_success "Backend is ready!"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
        echo -n "."
    done
    echo ""
    return 1
}

# Check if npm is available
if ! command -v npm >/dev/null 2>&1 || ! npm --version >/dev/null 2>&1; then
    print_error "npm is not working. Please run frontend/repair-npm.sh first"
    print_info "Or run: frontend/fix-npm-permanent.sh"
    exit 1
fi

# Check if frontend dependencies are installed
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    print_warning "Frontend dependencies not installed. Installing..."
    cd "$FRONTEND_DIR"
    npm install || {
        print_error "Failed to install frontend dependencies"
        exit 1
    }
    print_success "Frontend dependencies installed"
fi

# Check if backend is already running
print_info "Checking if backend is running..."
if check_backend; then
    print_success "Backend is already running at http://localhost:8000"
    BACKEND_STARTED=false
else
    print_info "Backend is not running. Starting it now..."
    
    # Check if uv is available
    if ! command -v uv >/dev/null 2>&1; then
        print_error "uv is not installed. Backend cannot start."
        print_info "Install with: pip install uv"
        print_info "Please install uv and try again, or start backend manually"
        exit 1
    fi
    
    # Check if backend dependencies are installed
    if [ ! -d "$BACKEND_DIR/.venv" ]; then
        print_warning "Backend dependencies not installed"
        print_info "Installing backend dependencies with uv sync..."
        cd "$BACKEND_DIR"
        uv sync || {
            print_error "Failed to install backend dependencies"
            exit 1
        }
        print_success "Backend dependencies installed"
    fi
    
    # Check for .env file and load OPENAI_API_KEY if available
    if [ -f "$PROJECT_ROOT/.env" ]; then
        print_info "Found .env file, loading environment variables..."
        export $(grep -v '^#' "$PROJECT_ROOT/.env" | grep OPENAI_API_KEY | xargs)
    fi
    
    # Check if OPENAI_API_KEY is set
    if [ -z "$OPENAI_API_KEY" ]; then
        print_warning "OPENAI_API_KEY is not set"
        print_info "The backend requires an OpenAI API key to run."
        echo ""
        print_info "You can:"
        echo "  1. Create a .env file in the project root with:"
        echo "     OPENAI_API_KEY=sk-..."
        echo ""
        echo "  2. Or enter it now (will be used for this session only):"
        echo ""
        read -p "Enter your OPENAI_API_KEY (or press Enter to exit): " api_key_input
        
        if [ -n "$api_key_input" ]; then
            export OPENAI_API_KEY="$api_key_input"
            print_success "API key set for this session"
            
            # Offer to save to .env
            read -p "Save to .env file for future use? (y/n): " save_env
            if [[ "$save_env" =~ ^[Yy]$ ]]; then
                if [ ! -f "$PROJECT_ROOT/.env" ]; then
                    echo "OPENAI_API_KEY=$api_key_input" > "$PROJECT_ROOT/.env"
                    print_success "Saved to .env file"
                else
                    # Update existing .env
                    if grep -q "OPENAI_API_KEY" "$PROJECT_ROOT/.env"; then
                        sed -i.bak "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$api_key_input/" "$PROJECT_ROOT/.env"
                        rm -f "$PROJECT_ROOT/.env.bak"
                    else
                        echo "OPENAI_API_KEY=$api_key_input" >> "$PROJECT_ROOT/.env"
                    fi
                    print_success "Updated .env file"
                fi
            fi
        else
            print_error "Cannot start backend without OPENAI_API_KEY"
            print_info "Please create a .env file or set the environment variable and try again"
            exit 1
        fi
    else
        print_success "OPENAI_API_KEY found"
    fi
    
    # Determine OS and start backend in new terminal
    OS="$(uname -s)"
    cd "$BACKEND_DIR"
    
    if [[ "$OS" == "Darwin" ]]; then
        # macOS - use osascript to open new Terminal window
        print_info "Starting backend in new Terminal window (macOS)..."
        
        # Create a temporary script to run backend
        BACKEND_SCRIPT="/tmp/start_backend_$$.sh"
        
        # Build the script with proper escaping
        {
            echo "#!/bin/bash"
            echo "cd \"$BACKEND_DIR\""
            if [ -f "$PROJECT_ROOT/.env" ]; then
                echo "if [ -f \"$PROJECT_ROOT/.env\" ]; then"
                echo "    export \$(grep -v '^#' \"$PROJECT_ROOT/.env\" | grep OPENAI_API_KEY | xargs)"
                echo "fi"
            fi
            echo "export OPENAI_API_KEY=\"$OPENAI_API_KEY\""
            echo "echo \"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\""
            echo "echo \"  Backend Server Starting\""
            echo "echo \"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\""
            echo "echo \"\""
            echo "echo \"Backend URL: http://localhost:8000\""
            echo "echo \"API Docs:    http://localhost:8000/docs\""
            echo "echo \"\""
            echo "echo \"Press Ctrl+C to stop the backend\""
            echo "echo \"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\""
            echo "echo \"\""
            echo "uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8000"
            echo "echo \"\""
            echo "echo \"Backend stopped. This window will close in 5 seconds...\""
            echo "sleep 5"
        } > "$BACKEND_SCRIPT"
        
        chmod +x "$BACKEND_SCRIPT"
        
        # Open in new Terminal window
        osascript << APPLESCRIPT_EOF
tell application "Terminal"
    do script "$BACKEND_SCRIPT"
    activate
end tell
APPLESCRIPT_EOF
        
        print_success "Backend starting in new Terminal window"
        
    elif [[ "$OS" == "Linux" ]]; then
        # Linux - try to detect desktop environment
        ENV_LOAD=""
        if [ -f "$PROJECT_ROOT/.env" ]; then
            ENV_LOAD="export \$(grep -v '^#' '$PROJECT_ROOT/.env' | grep OPENAI_API_KEY | xargs) && "
        fi
        
        if command -v gnome-terminal >/dev/null 2>&1; then
            print_info "Starting backend in new gnome-terminal window..."
            gnome-terminal -- bash -c "cd '$BACKEND_DIR' && ${ENV_LOAD}export OPENAI_API_KEY='$OPENAI_API_KEY' && echo 'Backend Server Starting...' && echo 'URL: http://localhost:8000' && uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8000; exec bash" &
        elif command -v xterm >/dev/null 2>&1; then
            print_info "Starting backend in new xterm window..."
            xterm -e "cd '$BACKEND_DIR' && ${ENV_LOAD}export OPENAI_API_KEY='$OPENAI_API_KEY' && echo 'Backend Server Starting...' && uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8000; bash" &
        else
            # Fallback: start in background in current terminal
            print_warning "Could not detect terminal. Starting backend in background..."
            cd "$BACKEND_DIR"
            if [ -f "$PROJECT_ROOT/.env" ]; then
                export $(grep -v '^#' "$PROJECT_ROOT/.env" | grep OPENAI_API_KEY | xargs)
            fi
            export OPENAI_API_KEY="$OPENAI_API_KEY"
            uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
            BACKEND_PID=$!
        fi
    else
        # Windows (Git Bash or WSL) - start in background
        print_info "Starting backend in background..."
        cd "$BACKEND_DIR"
        if [ -f "$PROJECT_ROOT/.env" ]; then
            export $(grep -v '^#' "$PROJECT_ROOT/.env" | grep OPENAI_API_KEY | xargs)
        fi
        export OPENAI_API_KEY="$OPENAI_API_KEY"
        uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
        BACKEND_PID=$!
    fi
    
    BACKEND_STARTED=true
    
    # Wait for backend to be ready
    if ! wait_for_backend; then
        print_error "Backend failed to start or is not responding"
        print_info "Check the backend terminal window for errors"
        exit 1
    fi
fi

# Start frontend
print_info "Starting frontend development server..."
cd "$FRONTEND_DIR"

print_success "\n${BOLD}Application Starting!${NC}"
echo ""
print_success "Frontend: ${BOLD}http://localhost:3000${NC}"
print_success "Backend:  ${BOLD}http://localhost:8000${NC}"
echo ""

if [ "$BACKEND_STARTED" = true ]; then
    print_info "Backend is running in a separate terminal window"
    print_info "You can close that window to stop the backend"
fi

echo ""
print_info "Press Ctrl+C to stop the frontend server"
echo ""
print_info "Starting frontend..."
echo ""

# Start the frontend (this blocks)
npm run dev

