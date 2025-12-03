import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Самый надёжный вариант под Vite 5+
      '@': path.resolve(__dirname, './src'),
    },
  },
});
