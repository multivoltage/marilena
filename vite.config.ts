import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { SERVER_PORT } from "./src/const";

import type { UserConfig } from "vitest/config";

const test = {
  globals: true,
  environment: "node",
  threads: false,
  watch: false,
} as UserConfig["test"];

// https://vitejs.dev/config/
const isProd = process.env.NODE_ENV === "production";
export default defineConfig({
  plugins: [react()],
  server: { port: SERVER_PORT },
  build: {
    minify: false,
  },
});
