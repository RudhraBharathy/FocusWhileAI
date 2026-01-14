import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import manifest from "./manifest.json";
import { resolve } from "path";

const manifestWithEnv = (mode: string) => {
  const env = loadEnv(mode, process.cwd());
  const newManifest = {
    ...manifest,
    oauth2: {
      ...manifest.oauth2,
      client_id: env.VITE_GOOGLE_CLIENT_ID || manifest.oauth2.client_id,
    },
  };
  return newManifest;
};

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), crx({ manifest: manifestWithEnv(mode) as any })],

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
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
}));
