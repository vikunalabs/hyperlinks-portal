import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: [
      'lit',
      'lit/decorators.js',
      'lit/directives/class-map.js',
      '@vikunalabs/lit-ui-library'
    ]
  }
});