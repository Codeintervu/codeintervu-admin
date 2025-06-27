import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4000, // We can assign a specific port for the admin app
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
      },
    },
  },
});
