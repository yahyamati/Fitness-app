import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for the Spring Boot backend on port 8080
      '/api': {
        target: 'http://localhost:8080', // Requests to /api1 will go to port 8080
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path
      },
     
      
    },
  },
})
