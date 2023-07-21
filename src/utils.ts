import { UserConfig } from "./types";
import baseConfig from "./lib/baseConfig";
import logger from "node-color-log";
import path from "path";
import { CONFIG_FILE_NAME } from "./const";
import fs from "fs";
import argv from "minimist";

// this methods shoul never take arguments since I expected that retun only a config
export async function loadConfig() {
  try {
    const configDefault = await import(getPathConfig());
    const config: UserConfig = configDefault.default;

    return {
      ...baseConfig,
      ...config,
    };
  } catch (e) {
    logger.error(`error loading ${CONFIG_FILE_NAME}, so use default config`, e);
    logger.error(e);
    return baseConfig;
  }
}

export function getPathConfig() {
  const defaultPathConfig = path.join(process.cwd(), `./${CONFIG_FILE_NAME}`);
  const { project } = argv(process.argv.slice(2));
  if (!!project) {
    if (typeof project === "boolean") {
      logger.error(
        `you used --project but without specify path for ${CONFIG_FILE_NAME}`,
      );
    } else if (typeof project === "string") {
      return path.resolve(process.cwd(), project);
    }
  }

  return defaultPathConfig;
}

export function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
}

export function isEmailDirectory(
  inputFolderPath: string,
  f: fs.Dirent,
): boolean {
  const isDirectory = f.isDirectory();
  const hasIndexHtnml =
    isDirectory &&
    fs.existsSync(path.resolve(inputFolderPath, f.name, "index.html"));

  return hasIndexHtnml;
}
