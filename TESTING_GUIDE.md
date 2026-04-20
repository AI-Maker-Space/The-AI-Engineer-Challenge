# Testing Guide for Unified Start Script

## Pre-Testing Checklist

Before testing the unified start script, make sure you have:

1. ✅ **npm working** - Already fixed with `fix-npm-permanent.sh`
2. ✅ **uv installed** - Backend package manager (`pip install uv`)
3. ✅ **Backend dependencies installed** - Run `uv sync` from project root (one time)
4. ✅ **Frontend dependencies** - Script will auto-install if missing
5. ✅ **OpenAI API Key** - Either in `.env` file or ready to enter when prompted

## Best Way to Test

### Option 1: Clean Test (Recommended)

**Step 1: Kill existing processes**
```bash
# Kill any existing backend/frontend processes
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
```

**Step 2: Verify backend dependencies**
```bash
# From project root - check if .venv exists (means uv sync was run)
ls -la .venv 2>/dev/null || echo "Need to run: uv sync"
```

If `.venv` doesn't exist, run:
```bash
uv sync
```

**Step 3: Prepare API key**
```bash
# Option A: Create .env file (recommended - one time setup)
echo "OPENAI_API_KEY=sk-your-actual-key-here" > .env

# Option B: Be ready to enter it when prompted
# (Script will ask if not found in .env or environment)
```

**Step 4: Test the start script**
```bash
# Open a NEW terminal window
# Navigate to project root
cd /Users/michaeldoran/dev/The-AI-Engineer-Challenge

# Run the unified start script
./start.sh
```

### Option 2: Test with Backend Already Running

If you want to test that it detects an existing backend:

1. Keep your current backend terminal running
2. Open a new terminal
3. Run `./start.sh`
4. It should detect the backend and only start the frontend

### Option 3: Test with No Backend

1. Make sure no backend is running (kill any on port 8000)
2. Open a new terminal
3. Run `./start.sh`
4. It should:
   - Detect backend is not running
   - Open a new Terminal window for backend
   - Wait for backend to be ready
   - Start frontend

## What to Expect

### Successful Run:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  AI Engineer Challenge - Starting Application
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ Checking if backend is running...
ℹ Backend is not running. Starting it now...
ℹ Starting backend in new Terminal window (macOS)...
✓ Backend starting in new Terminal window
ℹ Waiting for backend to be ready...
..........✓ Backend is ready!
ℹ Starting frontend development server...

✓ Application Starting!

Frontend: http://localhost:3000
Backend:  http://localhost:8000

ℹ Backend is running in a separate terminal window
ℹ You can close that window to stop the backend
ℹ Press Ctrl+C to stop the frontend server
ℹ Starting frontend...
```

### If Backend Already Running:
```
✓ Backend is already running at http://localhost:8000
ℹ Starting frontend development server...
```

## Troubleshooting

### If npm not working:
```bash
cd frontend
./fix-npm-permanent.sh
```

### If uv not installed:
```bash
pip install uv
```

### If backend dependencies not installed:
```bash
uv sync
```

### If port 8000 is in use:
```bash
lsof -ti:8000 | xargs kill -9
```

### If port 3000 is in use:
```bash
lsof -ti:3000 | xargs kill -9
```

## What Gets Started

- **Backend**: Opens in a NEW Terminal window (separate from your current terminal)
- **Frontend**: Runs in your CURRENT terminal (you'll see the Next.js output)

## Stopping the Application

- **Backend**: Close the Terminal window it's running in, or press Ctrl+C in that window
- **Frontend**: Press Ctrl+C in your current terminal

## Next Steps After Testing

Once everything works:
1. You can simplify by just running `./start.sh` anytime
2. Keep your `.env` file with API key for future runs
3. The script handles everything automatically!

