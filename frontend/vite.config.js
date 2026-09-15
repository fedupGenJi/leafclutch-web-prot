import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Content API and brand assets both live on the backend.
      '/api': 'http://localhost:5000',
      '/assets': 'http://localhost:5000',
    },
  },
});
