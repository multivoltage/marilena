import { Config } from "./types";
import baseConfig from "./lib/baseConfig";
import logger from "node-color-log";
import path from "path";

export async function loadConfig() {
  try {
    const pathConfig = path.join(process.cwd(), "./config.json");
    const config: Config = await require(pathConfig);

    return {
      ...baseConfig,
      ...config,
    };
  } catch (e) {
    logger.error("error loading config.json, so use default config", e);
    return baseConfig;
  }
}

export function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
}
