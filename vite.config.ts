import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@public': path.resolve(__dirname, './public'),
    },
  },
  root: '.',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
});
