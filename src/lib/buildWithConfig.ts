import fs from "fs";
import path from "path";
import { CoreConfig } from "../types";
import { buildSingle } from "./buildSingleWithConfig";
import { getPathConfig, isEmailDirectory } from "../utils";

export async function build(config: CoreConfig) {
  const { inputFolder, outputFolder } = config;

  const inputFolderPath = path.resolve(getPathConfig(), "..", inputFolder);
  const outputFolderPath = path.resolve(getPathConfig(), "..", outputFolder);

  // create folder if not exist
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
  }

  let list: string[];

  try {
    const files = fs.readdirSync(inputFolderPath, { withFileTypes: true });
    list = files
      .filter((f) => isEmailDirectory(inputFolderPath, f))
      .map((f) => f.name);
  } catch (e) {
    console.error(e);
    list = [];
  }

  for (const emailName of list) {
    await buildSingle(config, emailName);
  }
}
