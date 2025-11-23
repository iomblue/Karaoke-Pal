import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const apiKey = env.API_KEY ?? env.GEMINI_API_KEY ?? env.VITE_API_KEY ?? env.VITE_GEMINI_API_KEY ?? '';

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    // Expose API_KEY to the client bundle for runtime use
    define: {
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
    },
  };
});
