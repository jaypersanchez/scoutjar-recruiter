import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import history from "connect-history-api-fallback";
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProd ? '/recruiter/' : '/',
  plugins: [,
    react(),
    tailwindcss(),
    {
      name: "custom-history-fallback",
      configureServer(server) {
        server.middlewares.use(
          history({
            index: "/recruiter/index.html",
            disableDotRule: true,
            htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
            /*rewrites: [
              {
                from: /^\/recruiter\/.*\.(png|jpe?g|svg|ico|woff2?|ttf|js|css)$/,
                to: ctx => ctx.parsedUrl.pathname,
              },
            ],*/
            /*rewrites: [
              {
                // ✅ Skip fallback for static assets like images
                from: /^\/recruiter\/.*\.(png|jpe?g|svg|ico|woff2?|ttf|js|css|pdf|map)$/i,
                to: ctx => ctx.parsedUrl.pathname, // allow direct access
              },
              {
                // ✅ Fallback only for recruiter app routes
                from: /^\/recruiter\/.*$/,
                to: "/recruiter/index.html",
              },
            ],*/

          })
        );
      },
    },
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    port: 5173,
    allowedHosts: ["localhost", "lookk.ai", "dev.lookk.ai"],
    cors: true,
    fs: {
      strict: false,
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
