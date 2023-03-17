import { loadConfig } from "../utils";
import { build } from "./buildWithConfig";

async function buildAllEmail() {
  const config = await loadConfig();
  build(config);
}

buildAllEmail();
