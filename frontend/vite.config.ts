import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Vite configuration for the LLM-powered frontend.
// This keeps things simple and works both locally and on Vercel.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  }
});


