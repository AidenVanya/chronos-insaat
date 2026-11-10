import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { apiMiddleware } from './server/api.js';

function chronosBackendPlugin() {
  return {
    name: 'chronos-backend-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          return apiMiddleware(req, res, next);
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          return apiMiddleware(req, res, next);
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), chronosBackendPlugin()],
});
