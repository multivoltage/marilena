import { Config } from "./lib/type";
import baseConfig from "./lib/baseConfig";

export async function loadConfig() {
  try {
    const config: Config = (await require("../config")).default;

    return {
      ...baseConfig,
      ...config,
    };
  } catch {
    return baseConfig;
  }
}

export function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
}
