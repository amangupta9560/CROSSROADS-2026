import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  esbuild:
    mode === 'production'
      ? {
          drop: ['console', 'debugger'],
        }
      : undefined,
  build: {
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // Keep core React + Router together cleanly with no downstream manual chunks pulling React back
          if (
            /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(
              id
            )
          ) {
            return 'vendor-react';
          }
          // Pure JS / WebGL libraries with zero circular React interop
          if (/[\\/]node_modules[\\/]three[\\/]/.test(id)) {
            return 'vendor-three';
          }
          if (/[\\/]node_modules[\\/]gsap[\\/]/.test(id)) {
            return 'vendor-gsap';
          }
          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) {
            return 'vendor-motion';
          }
          if (/[\\/]node_modules[\\/]axios[\\/]/.test(id)) {
            return 'vendor-http';
          }
          if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) {
            return 'vendor-icons';
          }
          return undefined;
        },
      },
    },
  },
}));
