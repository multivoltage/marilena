import { Config } from "./lib/type";
import baseConfig from "./lib/baseConfig";
import logger from "node-color-log";

export async function loadConfig() {
  try {
    const config: Config = await require("../config.json");

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
