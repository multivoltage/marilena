import { removeExtension } from "../utils";
import fs from "fs";
import path from "path";
import { Config } from "./type";
import { inputOutputHtml } from "./inputOutputHtml";
import loadVariables from "./loadVariables";
import logger from "node-color-log";

export function build(config: Config) {
  const { inputFolder, outputFolder, templateSuffix, locales } = config;

  const inputFolderPath = path.join(inputFolder);
  const outputFolderPath = path.join(outputFolder);

  // create folder if not exist
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
  }

  let list: string[];
  try {
    list = fs
      .readdirSync(inputFolderPath)
      .filter((name) => name.endsWith(templateSuffix));
  } catch {
    list = [];
  }

  list.forEach((fileName) => {
    // create /[outputFolderPath]/[emailName] if not existing
    const folderEmailPath = path.join(
      outputFolderPath,
      removeExtension(fileName)
    );
    if (!fs.existsSync(folderEmailPath)) {
      fs.mkdirSync(folderEmailPath, { recursive: true });
    }

    const mjmlTemplate = fs.readFileSync(`${inputFolder}/${fileName}`, "utf-8");

    locales.forEach((locale) => {
      // create /[outputFolderPath]/[emailName]/[lang] if not existing
      const folderEmailPathLang = path.join(
        outputFolderPath,
        removeExtension(fileName),
        locale
      );
      if (!fs.existsSync(folderEmailPathLang)) {
        fs.mkdirSync(folderEmailPathLang, { recursive: true });
      }

      const variables = loadVariables(locale);
      const html = inputOutputHtml({
        inputHtml: mjmlTemplate,
        variables,
      });

      try {
        fs.writeFileSync(path.join(folderEmailPathLang, "index.html"), html, {
          encoding: "utf-8",
        });
        logger.info("writed", fileName);
      } catch (e) {
        logger.error("failed writing", fileName, e);
      }
    });
  });
}
