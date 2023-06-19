import fs from "fs";
import path from "path";
import { Config } from "../types";
import { buildSingle } from "./buildSingleWithConfig";

export function build(config: Config) {
  const { inputFolder, outputFolder } = config;

  const inputFolderPath = path.join(inputFolder);
  const outputFolderPath = path.join(outputFolder);

  // create folder if not exist
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
  }

  let list: string[];

  function isEmailDirectory(f: fs.Dirent): boolean {
    const isDirectory = f.isDirectory();
    const hasIndexHtnml =
      isDirectory &&
      fs.existsSync(
        path.resolve(process.cwd(), inputFolder, f.name, "index.html")
      );
    return hasIndexHtnml;
  }

  try {
    const files = fs.readdirSync(inputFolderPath, { withFileTypes: true });
    list = files.filter(isEmailDirectory).map((f) => f.name);
  } catch (e) {
    console.error(e);
    list = [];
  }

  list.forEach((emailName) => {
    buildSingle(config, emailName);
  });
}
