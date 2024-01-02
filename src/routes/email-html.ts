import { getPathConfig, loadConfig } from "../utils.js";
import { RequestHandler } from "express";
import fs from "node:fs";
import path from "node:path";
import { inputOutputHtml } from "../lib/inputOutputHtml.js";
import { VARIABLES_LOADER } from "../lib/loadVariables.js";

export const handler: RequestHandler = async (request, res) => {
  const config = await loadConfig();
  const { inputFolder, mjmlParsingOptions, sendTestOptions, fillFakeMetaData } =
    config;
  const emailName: string = (request.params as any).emailName;
  const locale: string = (request.params as any).locale;
  const fillFakeMetaDataQuery: string | undefined = (request.query as any)
    .fillFakeMetaData;
  const needFillWithFakeMetaData =
    !!fillFakeMetaDataQuery && fillFakeMetaDataQuery.toLowerCase() === "true";

  const filePath = path.resolve(
    getPathConfig(),
    "..",
    inputFolder,
    emailName,
    "index.html",
  );

  const mjmlTemplate = fs.readFileSync(filePath, "utf-8");

  let html = await inputOutputHtml({
    inputHtml: mjmlTemplate,
    variables: VARIABLES_LOADER.loadAll({ config, locale }, emailName),
    templateOptions: config.templateOptions,
    mjmlParsingOptions,
    isTextVersion: false,
  });

  if (needFillWithFakeMetaData) {
    if (!fillFakeMetaData) {
      res
        .status(400)
        .send(
          `you chosed to fill email with fake metadata but "fillFakeMetaData" handler is not defined in config`,
        );
      return;
    }
    const fakeMetadata = VARIABLES_LOADER.loadMetadata(
      {
        config,
        locale,
      },
      emailName,
    );
    html = fillFakeMetaData(html, fakeMetadata);
  }

  res.header("content-type", "text/html");
  res.send(html);
};
