# Matrix Terminal Frontend

A matrix-style terminal chat interface built with Next.js, featuring an animated matrix rain effect in the background.

## Features

- 🎨 Matrix-style terminal aesthetic with green text on black background
- 🌧️ Animated matrix rain effect in the background
- 💬 Real-time chat interface connected to FastAPI backend
- ⌨️ Terminal-style input with prompt symbols
- 📜 Scrollable message history
- ✨ Smooth animations and transitions

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:8000` (see main README for backend setup)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. **Start the backend server first** (from the project root):
   ```bash
   # Make sure you have your OPENAI_API_KEY set
   export OPENAI_API_KEY=sk-...
   
   # Start the backend
   uv run uvicorn api.index:app --reload
   ```

2. **Start the frontend development server** (from the frontend directory):
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Development

- The app uses Next.js 14 with the App Router
- Hot reload is enabled during development
- The frontend automatically proxies API requests to the FastAPI backend:
  - **Local development**: Next.js rewrites `/api/*` to `http://localhost:8000/api/*`
  - **Production (Vercel)**: Vercel routes `/api/*` to the FastAPI backend via `vercel.json`
- The frontend calls `/api/chat` which connects to the FastAPI endpoint at `POST /api/chat`

## Building for Production

To create a production build:

```bash
npm run build
npm start
```

## Deployment

This frontend is configured to work with Vercel. To deploy:

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Deploy from the frontend directory:
   ```bash
   vercel
   ```

3. Follow the prompts to complete deployment

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx         # Main chat interface page
│   └── globals.css      # Global styles with matrix theme
├── components/
│   └── MatrixRain.tsx   # Matrix rain animation component
├── package.json         # Dependencies and scripts
├── next.config.js       # Next.js configuration
└── tsconfig.json        # TypeScript configuration
```

## Styling

The application uses a custom CSS theme with:
- Black background (`#000000`)
- Green text (`#00ff00`) with glow effects
- Terminal-style borders and shadows
- Smooth animations and transitions
- Custom scrollbar styling

## Troubleshooting

- **Connection errors**: Make sure the backend is running on `http://localhost:8000`
- **API errors**: Verify your `OPENAI_API_KEY` is set correctly in the backend environment
- **Build errors**: Ensure all dependencies are installed with `npm install`
