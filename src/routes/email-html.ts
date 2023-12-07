import { getPathConfig, loadConfig } from "../utils";
import { RequestHandler } from "express";
import fs from "node:fs";
import path from "node:path";
import { inputOutputHtml } from "src/lib/inputOutputHtml";
import { VARIABLES_LOADER } from "src/lib/loadVariables";

export const handler: RequestHandler = async (request, res) => {
  const config = await loadConfig();
  const { inputFolder, mjmlParsingOptions } = config;
  const emailName: string = (request.params as any).emailName;
  const locale: string = (request.params as any).locale;

  const filePath = path.resolve(
    getPathConfig(),
    "..",
    inputFolder,
    emailName,
    "index.html",
  );

  const mjmlTemplate = fs.readFileSync(filePath, "utf-8");

  const html = await inputOutputHtml({
    inputHtml: mjmlTemplate,
    variables: VARIABLES_LOADER.loadAll({ config, locale }, emailName),
    templateOptions: config.templateOptions,
    mjmlParsingOptions,
    isTextVersion: false,
  });

  res.header("content-type", "text/html");
  res.send(html);
};
