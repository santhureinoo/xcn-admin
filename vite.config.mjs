import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      // If you have path aliases in your tsconfig.json
      '@': path.resolve(__dirname, './src'),
    },
  },
  // If you need to specify a different port
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['ptd0vkeol.localto.net'],
  },
});