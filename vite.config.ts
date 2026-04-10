import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        entry: "src/main/main.ts",        
        vite: {
          build: {
            sourcemap: true,
            rollupOptions: {
              external: ["pg-hstore"],
            },
          },
          resolve: {
            alias: {
              "@": path.resolve(__dirname, "./src"),
            },
          },
        },
      },
      preload: {
        input: path.join(__dirname, "src/main/preload.ts"),
      },
      renderer: process.env.NODE_ENV === "test" ? undefined : {},
      
    }),
  ],
  
  build: {
    sourcemap: true,
  },
});
