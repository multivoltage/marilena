import { loadConfig } from "../utils.js";
import { build } from "./buildWithConfig.js";

async function buildAllEmail() {
  const config = await loadConfig();
  build(config);
}

buildAllEmail();
