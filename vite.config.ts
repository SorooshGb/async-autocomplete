import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/app': '/src/app',
      '@/assets': '/src/assets',
      '@/components': '/src/components',
      '@/hooks': '/src/hooks',
      '@/themes': '/src/themes',
      '@/styles': '/src/styles',
      '@/utils': '/src/utils',
      '@/config': '/src/config',
      '@/types': '/src/types',
      '@/api': '/src/api',
    },
  },
});
