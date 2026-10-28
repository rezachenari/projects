import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The frontend runs behind the Base44 preview proxy. Hosts arrive as
// "<port>-<sandbox id>.<sandbox domain>" so we only relax the dev-server host
// allowlist while inside the sandbox (BASE44_PREVIEW_MODE === '1').
const allowedHosts =
  process.env.BASE44_PREVIEW_MODE === '1' && process.env.BASE44_SANDBOX_HOST_DOMAIN
    ? ['.' + process.env.BASE44_SANDBOX_HOST_DOMAIN]
    : [];

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts,
    watch: { usePolling: true, interval: 300 },
    proxy: {
      '/api': {
        target: process.env.API_INTERNAL_URL || 'http://api:8000',
        changeOrigin: true,
      },
    },
  },
});
