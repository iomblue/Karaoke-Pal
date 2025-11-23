import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    // Allow reading API_KEY/GEMINI_* directly via import.meta.env
    envPrefix: ['VITE_', 'API_', 'GEMINI_'],
  };
});
