import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  video: false,
  chromeWebSecurity: false,
  env: {
    SEND_TEST_OPTION_TO: "example-to@gmail.com",
  },
});
