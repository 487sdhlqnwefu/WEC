import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import devServer from "@hono/vite-dev-server"
import { inspectAttr } from "kimi-plugin-inspect-react"

const __dirname = import.meta.dirname

export default defineConfig(({ mode }) => ({
  plugins: [
    ...(mode === "development" ? [inspectAttr()] : []),
    devServer({ entry: "api/boot.ts", exclude: [/^\/(?!api\/).*$/] }),
    react(),
  ],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      db: path.resolve(__dirname, "./db"),
    },
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
}))
