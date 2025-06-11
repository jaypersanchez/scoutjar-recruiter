import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: '/recruiter/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // 🚨 THIS IS THE FIX 🚨
    port: 5173,
    allowedHosts: [
      'localhost',
      'lookk.ai',
      'www.lookk.ai',
      'dev.lookk.ai',
      'demo.lookk.ai'
    ],
    cors: true,
    fs: {
      strict: false,
    }
  }
});