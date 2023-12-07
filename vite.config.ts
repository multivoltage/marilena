import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { SERVER_PORT } from "./src/const";
// https://vitejs.dev/config/
const isProd = process.env.NODE_ENV === "production";
export default defineConfig({
  plugins: [react()],
  server: { port: SERVER_PORT },
  build: {
    minify: false,
  },
});
