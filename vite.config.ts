import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import manifest from "./manifest.json";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), crx({ manifest })],

  resolve: { alias: { "@": resolve(__dirname, "src") } },

  server: {
    port: 5173,
    strictPort: true,
    hmr: { port: 5173 },
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    },
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  build: {
    rollupOptions: {
      input: {
        onboarding: resolve(__dirname, "onboarding.html"),
        popup: resolve(__dirname, "popup.html"),
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
