import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4000, // We can assign a specific port for the admin app
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
          icons: ["lucide-react", "react-icons"],
        },
      },
    },
    // Optimize for production
    target: "es2015",
    assetsInlineLimit: 4096,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "axios"],
  },
});
