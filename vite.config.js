import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:3000', // Proxy /api requests to Express backend
        },
    },
    build: {
        outDir: 'dist', // Prevents interfering with your main project
    },
    optimizeDeps: {
        include: ['three', 'three/examples/jsm/loaders/FontLoader.js', 'three/examples/jsm/geometries/TextGeometry.js']
    }
});