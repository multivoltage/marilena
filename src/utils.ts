import { Config } from "./types";
import baseConfig from "./lib/baseConfig";
import logger from "node-color-log";
import path from "path";
import { CONFIG_FILE_NAME } from "./const";
import fs from "fs";

export async function loadConfig() {
  try {
    const pathConfig = path.join(process.cwd(), `./${CONFIG_FILE_NAME}`);
    const config: Config = await require(pathConfig);

    return {
      ...baseConfig,
      ...config,
    };
  } catch (e) {
    logger.error(`error loading ${CONFIG_FILE_NAME}, so use default config`, e);
    return baseConfig;
  }
}

export function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
}

export function isEmailDirectory(inputFolder: string, f: fs.Dirent): boolean {
  const isDirectory = f.isDirectory();
  const hasIndexHtnml =
    isDirectory &&
    fs.existsSync(
      path.resolve(process.cwd(), inputFolder, f.name, "index.html")
    );
  return hasIndexHtnml;
}
