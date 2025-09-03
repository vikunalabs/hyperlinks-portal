import { defineConfig } from 'vite';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Bundle analysis visualization (only in build mode)
    process.env.NODE_ENV === 'production' && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },
  build: {
    // Production optimizations
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Enhanced code splitting for better caching
        manualChunks: (id) => {
          // Vendor chunk for external dependencies
          if (id.includes('node_modules')) {
            if (id.includes('lit')) {
              return 'lit-vendor';
            }
            return 'vendor';
          }
          
          // Modals chunk for modal components
          if (id.includes('/components/modals/')) {
            return 'modals';
          }
          
          // UI components chunk
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
          
          // Utils chunk for utilities
          if (id.includes('/utils/')) {
            return 'utils';
          }
          
          // Pages chunk for page components
          if (id.includes('/components/pages/')) {
            return 'pages';
          }
        },
        // Consistent file names for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable source maps for production debugging
    sourcemap: process.env.NODE_ENV !== 'production' ? true : 'hidden',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Target modern browsers for better optimization
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // CSS code splitting
    cssCodeSplit: true,
    // Optimize dependencies
    optimizeDeps: {
      include: ['lit'],
    },
  },
  server: {
    // Development server optimizations
    hmr: {
      overlay: true
    }
  },
  preview: {
    port: 3000
  },
  define: {
    // Define environment variables
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Disable Lit dev mode in production
    'globalThis.litDisableWarnings': JSON.stringify(process.env.NODE_ENV === 'production'),
  },
});