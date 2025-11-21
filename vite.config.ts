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
    // Expose API_KEY to the client bundle for runtime use
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY ?? ''),
    },
  };
});
