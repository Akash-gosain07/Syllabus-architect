import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // CRITICAL FIX for Vercel:
  // Vercel injects environment variables into 'process.env' during the build command.
  // loadEnv() primarily reads from .env files. We must check process.env first.
  const apiKey = process.env.API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // This performs a static replacement during build.
      // Every instance of `process.env.API_KEY` in your code will be replaced 
      // with the actual string value from your Vercel settings.
      // We use JSON.stringify to ensure it is inserted as a valid string literal.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    build: {
      outDir: 'dist',
    },
  };
});