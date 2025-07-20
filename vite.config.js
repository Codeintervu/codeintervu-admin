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
        target: "http://localhost:5000", // Use localhost backend for development
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild", // Use esbuild instead of terser
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@mantine/core", "@mantine/hooks"],
        },
      },
    },
  },
});
