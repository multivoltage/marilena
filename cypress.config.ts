import { defineConfig } from "cypress";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  video: false,
  chromeWebSecurity: false,
});
