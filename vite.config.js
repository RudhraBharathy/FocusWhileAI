import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import manifest from "./manifest.json";
import { resolve } from "path"; // Import this

export default defineConfig({
  plugins: [react(), tailwindcss(), crx({ manifest })],
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
  // --- ADD THIS BLOCK ---
  build: {
    rollupOptions: {
      input: {
        // This tells Vite: "Also build these HTML files"
        onboarding: resolve(__dirname, "onboarding.html"),
        // If you have index.html (popup), it's automatically handled by manifest,
        // but it doesn't hurt to list it here too:
        popup: resolve(__dirname, "index.html"),
      },
    },
  },
});
