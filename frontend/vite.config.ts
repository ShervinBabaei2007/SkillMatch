import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, type Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()] as unknown as Plugin[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (
            id.includes("node_modules/react") ||
            id.includes("react-dom") ||
            id.includes("react-router-dom")
          ) {
            return "react";
          }
          if (id.includes("sonner")) {
            return "ui";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
