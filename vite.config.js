import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: true,
    proxy: {
      '/uploads': {
        target: 'http://localhost:3200',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
