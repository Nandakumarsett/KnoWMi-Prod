import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-3d';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('leaflet') || id.includes('react-leaflet') || id.includes('react-simple-maps')) {
              return 'vendor-maps';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('gsap') || id.includes('framer-motion') || id.includes('lenis')) {
              return 'vendor-animation';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor'; // Fallback for other modules
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Raise the warning limit slightly since we've broken it down
  }
})
