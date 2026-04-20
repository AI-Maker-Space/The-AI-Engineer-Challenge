# Frontend - AI Mental Coach

A beautiful, contemporary mid-century modern-inspired frontend for the AI Mental Coach application, featuring a soothing Minecraft-like ambient soundscape.

## 🎨 Design Features

- **Contemporary Mid-Century Modern Aesthetic**: Clean lines, geometric shapes, and a minimalist layout
- **Animated Blue/Silver Gradient Background**: Rich, glowing, shifting animated gradient that creates a calming atmosphere
- **Soothing Background Music**: Minecraft-inspired ambient soundscape that enhances focus and relaxation
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Smooth Animations**: Elegant fade-in effects and transitions throughout

## 🚀 Getting Started

### Quick Setup (Automated)

**Option 1: Use the automated setup script** (Recommended)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Run the setup script:
   ```bash
   ./setup.sh
   ```

   This script will:
   - Check Node.js installation
   - Install all dependencies
   - Verify backend configuration
   - Provide instructions for next steps

3. Once setup is complete, start the application:
   ```bash
   ./start.sh
   ```
   This will start both frontend and backend servers automatically.

### Manual Setup

### Prerequisites

- Node.js 18+ (npm included)
- Backend API running (see main README.md for backend setup)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. (Optional) Add background music:
   - Download a royalty-free ambient track (see `public/music/README.md` for recommendations)
   - Place `ambient-background.mp3` and `ambient-background.ogg` in `public/music/`
   - If no local files are present, the app will use a fallback external source

### Configuration

The frontend connects to the backend API. By default, it expects the backend to be running at:
- `http://localhost:8000` (development)

To change this, create a `.env.local` file in the frontend directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, set this to your deployed backend URL.

### Running the Application

**Important: Terminal Setup**

Since the backend runs continuously and blocks the terminal, you have two options:

**Option 1: Backend already running in another terminal** (Recommended)

- **No API key needed** - Frontend doesn't require OPENAI_API_KEY
- Open a **new terminal window/tab**
- Navigate to the frontend directory
- Run the frontend-only script:
  ```bash
  cd frontend
  ./start-frontend.sh
  ```
  This will:
  - Check if dependencies are installed (and install if needed)
  - Verify backend is accessible
  - Start the frontend development server
  - Run in the foreground (you can see the logs)

**Option 2: Start both servers together**

From the frontend directory:
```bash
./start.sh
```

This script will:
- Check dependencies and install if needed
- **Requires OPENAI_API_KEY** (since it starts the backend)
- Start the backend server in the background (if `uv` is available)
- Start the frontend development server
- Show you the URLs and log locations
- Handle cleanup when you press Ctrl+C (stops both servers)

> **Note:** This script requires `OPENAI_API_KEY` to be set because it starts the backend. If you already have the backend running in another terminal, use Option 1 instead (it doesn't require the API key).

**Option 3: Manual start** (Separate terminals)

1. **Start the backend** (from project root):
   ```bash
   # Make sure you have your OPENAI_API_KEY set
   export OPENAI_API_KEY=sk-...
   
   # Start the FastAPI server
   uv run uvicorn api.index:app --reload
   ```
   The backend will run on `http://localhost:8000`

2. **Start the frontend** (from frontend directory):
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

---

> **Note:** In case npm fails or is not working, run the permanent fix script:
> ```bash
> cd frontend
> ./fix-npm-permanent.sh
> ```
> This script permanently fixes npm by installing Node.js via Homebrew. After running it, restart your terminal and continue with the setup steps above. This fix should be permanent and automatic every time the app is opened.

## 🎵 Background Music

The application includes a background music player with:
- **Play/Pause controls**: Toggle music on/off
- **Volume control**: Mute/unmute functionality
- **Auto-loop**: Seamless looping for continuous ambient sound
- **Subtle volume**: Set to 30% by default for non-intrusive background ambiance

The music player is located in the bottom-right corner of the screen.

### Adding Your Own Music

1. Download a royalty-free ambient track (Minecraft-like soundscape recommended)
2. Convert to both MP3 and OGG formats
3. Place files in `public/music/`:
   - `ambient-background.mp3`
   - `ambient-background.ogg`
4. The component will automatically use your local files

See `public/music/README.md` for detailed recommendations and sources.

## 🛠️ Setup Scripts

The frontend includes several helpful scripts to automate setup and running:

- **`setup.sh`** - Comprehensive setup script that:
  - Checks Node.js installation
  - Detects and repairs npm issues
  - Installs dependencies
  - Verifies backend configuration
  - Provides detailed feedback and instructions

- **`fix-npm-permanent.sh`** - **Permanent npm fix script (RECOMMENDED)** that:
  - Installs Node.js via Homebrew for proper package management
  - Permanently fixes npm installation
  - Updates PATH in shell configuration files
  - Provides a robust solution that won't break again
  - **Use this if npm is broken or not working**

- **`repair-npm.sh`** - Quick npm repair script that:
  - Attempts multiple methods to fix broken npm temporarily
  - Tries corepack, curl install, Homebrew, and more
  - Provides manual repair instructions if automatic repair fails
  - **Note: May not be permanent - use fix-npm-permanent.sh for lasting fix**

- **`start.sh`** - Start both servers script that:
  - Starts both backend and frontend servers together
  - Runs backend in background
  - Checks dependencies automatically
  - Shows log locations
  - Handles cleanup on exit (stops both)

- **`start-frontend.sh`** - Frontend-only start script that:
  - Starts only the frontend (when backend is already running)
  - Checks if backend is accessible
  - Verifies dependencies
  - Perfect for when backend is in another terminal

## 🏗️ Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles and animations
├── components/
│   ├── ChatInterface.tsx   # Main chat UI component
│   └── BackgroundMusic.tsx # Music player component
├── public/
│   └── music/              # Background music files (optional)
├── setup.sh                # Automated setup script
├── fix-npm-permanent.sh    # Permanent npm fix (RECOMMENDED if npm broken)
├── repair-npm.sh           # Quick npm repair script
├── start.sh                # Start both servers script
├── start-frontend.sh       # Start frontend only (backend running elsewhere)
├── package.json            # Dependencies and scripts
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🎯 Features

### Chat Interface
- Real-time conversation with the AI mental coach
- Auto-scrolling message history
- Loading indicators during API calls
- Error handling with user-friendly messages
- Responsive text input with auto-resize
- Enter to send, Shift+Enter for new line

### Design Elements
- **Mid-Century Modern**: Geometric shapes, clean typography, organic layouts
- **Animated Gradient**: Shifting blue/silver gradient background
- **Glass Morphism**: Frosted glass effect on chat container
- **Smooth Animations**: Fade-in effects for messages
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚢 Deployment

### Deploying to Vercel

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. From the frontend directory, run:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Link to your Vercel account
   - Confirm project settings
   - Set environment variables if needed:
     - `NEXT_PUBLIC_API_URL`: Your deployed backend URL

4. After deployment, update your backend CORS settings if needed to allow your Vercel domain.

### Environment Variables for Production

Create a `.env.production` file or set in Vercel dashboard:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **CSS Modules**: Scoped styling with global CSS
- **React Hooks**: Modern React patterns

## 🔗 Backend Integration

The frontend communicates with the FastAPI backend through:

- **Health Check**: `GET /api/health`
- **Chat Endpoint**: `POST /api/chat`
  - Request body: `{ "message": "user message" }`
  - Response: `{ "reply": "assistant response" }`

CORS is already configured on the backend to allow frontend requests.

## 🐛 Troubleshooting

### npm not working - PERMANENT FIX (Recommended)

**If npm is broken or not working, use this permanent fix:**

```bash
cd frontend
./fix-npm-permanent.sh
```

This script will:
- ✅ **Permanently fix npm** by installing Node.js via Homebrew
- ✅ **Properly manage** Node.js and npm installation
- ✅ **Update your PATH** automatically in shell config files
- ✅ **Provide a robust solution** that won't break again
- ✅ **Verify installation** and test npm functionality

**This is the recommended solution** as it uses Homebrew's package management to ensure npm is properly installed and maintained.

### Alternative fixes (if permanent fix doesn't work)

If the permanent fix script doesn't work, try these alternatives:

**Option 1: Manual Homebrew installation**
```bash
# Install Node.js (includes npm)
brew install node

# Add to PATH (if needed - script does this automatically)
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc  # ARM Mac
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc     # Intel Mac

# Restart terminal or source config
source ~/.zshrc
```

**Option 2: Use nvm (Node Version Manager)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install 18
nvm use 18
nvm alias default 18  # Set as default
```

**Option 3: Download from nodejs.org**
- Visit: https://nodejs.org/
- Download and install the LTS version
- This includes npm automatically

**Option 4: Quick repair attempt**
```bash
cd frontend
./repair-npm.sh
```
Note: This may not provide a permanent fix - use the permanent fix script instead.

### Music not playing
- Some browsers require user interaction before playing audio
- Click the play button to start music
- Check browser console for audio errors
- Ensure music files are in `public/music/` if using local files

### API connection errors
- Verify backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_API_URL` environment variable
- Ensure CORS is properly configured on backend
- Check browser console for detailed error messages
- Check backend logs: `tail -f /tmp/backend.log` (if using start.sh)

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)
- Run setup script again: `./setup.sh`

## 📝 Notes

- The design balances mid-century modern aesthetics with the required blue/silver gradient background
- Background music is optional and can be toggled on/off
- All animations are CSS-based for optimal performance
- The application is fully responsive and works on all screen sizes

## 🎉 Enjoy!

Start chatting with your AI mental coach and enjoy the calming ambiance!
