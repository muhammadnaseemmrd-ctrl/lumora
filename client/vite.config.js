import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxies /api and /uploads to the Express server during local development
// so the client can call relative paths without CORS headaches.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
      "/uploads": "http://localhost:5000"
    }
  }
});
