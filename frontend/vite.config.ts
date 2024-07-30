import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default ({ mode } : any) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      server: {
        proxy: {
          "/api": {
            target: process.env.VITE_API_BASE_URL,
            changeOrigin: true,
          },
        },
      },
  });
}