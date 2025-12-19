import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // CRITICAL FIX: Use the provided API Key as a fallback if the system environment variable is missing.
  // This ensures the app works immediately in preview environments.
  const apiKey = process.env.API_KEY || env.API_KEY || "AIzaSyDqnOFY-JKJK1ZlZUveOOlAsVRVPdSg_vk";

  return {
    plugins: [react()],
    define: {
      // This performs a static replacement during build.
      // Every instance of `process.env.API_KEY` in your code will be replaced 
      // with the actual string value.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    build: {
      outDir: 'dist',
    },
  };
});