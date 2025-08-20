import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ui: resolve(__dirname, 'src/components/ui/index.ts'),
        auth: resolve(__dirname, 'src/components/auth/index.ts'),
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['lit'],
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});