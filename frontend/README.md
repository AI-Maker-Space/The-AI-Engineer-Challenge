# Frontend Application - LLM-powered Chat Interface

This is a Vite + React + TypeScript + TailwindCSS frontend application that provides a modern, interactive chat interface for communicating with a FastAPI backend. The application features a beautiful, responsive UI with real-time chat capabilities.

---

## Tech Stack

- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **shadcn-style UI components** - Reusable UI components

---

## Prerequisites

Before running the application, ensure you have:

- **Node.js 18+** installed ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Backend API** running (see `../api/README.md` for backend setup)

---

## Local Development

### Step 1: Install Dependencies

Navigate to the frontend directory and install all required packages:

```bash
cd frontend
npm install
```

This will install all dependencies listed in `package.json`.

### Step 2: Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# Create .env file
touch .env  # On Windows: type nul > .env
```

Add the following content to `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

**Note:** If you don't create a `.env` file, the application will default to `http://localhost:8000` for the backend URL.

### Step 3: Start the Backend Server

Before running the frontend, make sure your FastAPI backend is running. From the repository root:

```bash
# Make sure you have your OpenAI API key set
export OPENAI_API_KEY=sk-your-key-here  # On Windows: set OPENAI_API_KEY=sk-your-key-here

# Start the backend server
uv run uvicorn api.index:app --reload
```

The backend should now be running on `http://localhost:8000`.

### Step 4: Start the Development Server

From the `frontend` directory, start the Vite development server:

```bash
npm run dev
```

The application will start and you should see output like:

```
  VITE v6.0.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Access the Application

Open your browser and navigate to `http://localhost:5173` (or the URL shown in the terminal).

You should now see the chat interface and be able to interact with the backend API.

---

## Production Deployment

### Option 1: Deploy to Vercel (Recommended)

Vercel provides seamless deployment for Vite applications with automatic builds and deployments.

#### Step 1: Build the Application

First, create a production build:

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist` folder.

#### Step 2: Deploy via Vercel CLI

Install Vercel CLI (if not already installed):

```bash
npm install -g vercel
```

Deploy the frontend:

```bash
# From the frontend directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No (or Yes if you have one)
# - Project name? (Enter a name or press Enter for default)
# - Directory? ./frontend (or just ./ if already in frontend)
```

#### Step 3: Configure Environment Variables in Vercel (production)

You can set environment variables using either the Vercel Dashboard or the CLI. Choose the method that works best for you.

**Option A: Using Vercel CLI (Command Line)**

Set the environment variable directly from the command line:

```bash
# Set for production environment
vercel env add VITE_API_BASE_URL production

example: VITE_API_BASE_URL= https://your-backend.vercel.app
```
**Option B: Using Vercel Dashboard**

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add the following environment variable:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** Your backend API URL (e.g., `https://your-backend.vercel.app` or your deployed backend URL)
   - **Environment:** Production, Preview, Development (select all)
6. Click **Save**

#### Step 4: Redeploy

After adding environment variables, trigger a new deployment:

```bash
vercel --prod
```

Or redeploy from the Vercel dashboard by clicking **Redeploy**.

#### Step 5: Verify Deployment

Visit your deployment URL (provided by Vercel) and verify that:
- The application loads correctly
- API calls are working (check browser console for any errors)
- The backend URL is correctly configured
---

## Troubleshooting

### Frontend can't connect to backend

- **Check backend is running:** Ensure the FastAPI server is running on `http://localhost:8000`
- **Check CORS:** Verify backend CORS settings allow requests from `http://localhost:5173`
- **Check environment variable:** Verify `VITE_API_BASE_URL` is set correctly in `.env`
- **Check browser console:** Look for CORS errors or network errors

### Build fails

- **Clear node_modules:** Delete `node_modules` and `package-lock.json`, then run `npm install` again
- **Check Node version:** Ensure you're using Node.js 18 or higher (`node --version`)
- **Check TypeScript errors:** Run `npm run typecheck` to see type errors

### Environment variables not working in production

- **Vercel:** Ensure environment variables are set in Vercel dashboard and redeployed
- **Build-time vs Runtime:** Remember that Vite environment variables are embedded at build time
- **Variable naming:** Must start with `VITE_` to be exposed to the client

### Port already in use

If port 5173 is already in use:

```bash
# Kill process on port 5173 (Linux/Mac)
lsof -ti:5173 | xargs kill -9

# Or specify a different port
npm run dev -- --port 3000
```

---

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── config/          # Configuration files
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
├── public/              # Static assets
├── dist/                # Production build output (generated)
├── .env                 # Environment variables (create this)
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.cjs  # TailwindCSS configuration
└── tsconfig.json        # TypeScript configuration
```

---

## How the Application Works

- **Chat Interface:** The main chat component (`useChat` hook) manages conversation state
- **API Communication:** All API calls are made to the backend using the configured `VITE_API_BASE_URL`
- **State Management:** React hooks (`useState`, `useCallback`) manage local component state
- **Error Handling:** Comprehensive error handling for API failures, network issues, and user feedback
- **Responsive Design:** TailwindCSS ensures the UI works on all screen sizes

---

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

## Support

For backend-related issues, see `../api/README.md`.

For deployment issues, check the Vercel documentation or your hosting provider's support resources.
