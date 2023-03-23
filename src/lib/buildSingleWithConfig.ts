import { removeExtension } from "../utils";
import fs from "fs";
import path from "path";
import { Config } from "./type";
import { inputOutputHtml } from "./inputOutputHtml";
import loadVariables from "./loadVariables";
import logger from "node-color-log";

export function buildSingle(config: Config, emailName: string) {
  const { inputFolder, outputFolder, locales } = config;

  const inputFolderPath = path.join(inputFolder);
  const outputFolderPath = path.join(outputFolder);

  const inputEmailFilePath = path.join(
    inputFolderPath,
    emailName,
    "index.html"
  );
  const mjmlTemplate = fs.readFileSync(inputEmailFilePath, "utf-8");

  // create folder for each email and locale if not exist
  locales.forEach((locale) => {
    const emailFolderPath = path.join(outputFolderPath, emailName, locale);
    if (!fs.existsSync(emailFolderPath)) {
      fs.mkdirSync(emailFolderPath, { recursive: true });
    }

    const variables = loadVariables({ config, locale, emailName });
    const html = inputOutputHtml({
      inputHtml: mjmlTemplate,
      variables,
      templateOptions: config.templateOptions,
    });

    const folderEmailPathLang = path.join(outputFolderPath, emailName, locale);
    if (!fs.existsSync(folderEmailPathLang)) {
      fs.mkdirSync(folderEmailPathLang, { recursive: true });
    }

    try {
      fs.writeFileSync(path.join(folderEmailPathLang, "index.html"), html, {
        encoding: "utf-8",
      });
      logger.info("writed", emailName, locale);
    } catch (e) {
      logger.error("failed writing", emailName, e);
    }
  });
}
