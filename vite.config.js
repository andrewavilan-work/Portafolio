import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Plugin implementation for React support
  plugins: [react()],
  
  // Ensure 3D assets are correctly handled as static assets
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  
  build: {
    rollupOptions: {
      output: {
        // Code splitting strategy to optimize load times and cache common dependencies
        manualChunks: {
          // Three.js grouped in its own chunk for better performance
          'vendor-three': ['three'],
          // React Three Fiber ecosystem
          'vendor-r3f': [
            '@react-three/fiber',
            '@react-three/drei',
          ],
          // Core React library
          'vendor-react': ['react', 'react-dom'],
          // Animation library
          'vendor-motion': ['framer-motion'],
        },
      },
    },
    // Increase warning limit slightly due to 3D asset overhead
    chunkSizeWarningLimit: 700,
  },
})
