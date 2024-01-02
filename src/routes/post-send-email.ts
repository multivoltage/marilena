import { RequestHandler } from "express";
import { getPathConfig, loadConfig } from "../utils.js";
import fs from "node:fs";
import { inputOutputHtml } from "../lib/inputOutputHtml.js";
import { VARIABLES_LOADER } from "../lib/loadVariables.js";
import { sendTestEmail } from "../lib/send-test-email.js";
import path from "node:path";

export type Params = {
  to: string;
  email: string;
  locale: string;
  fillFakeMetaData: boolean;
};

export const handler: RequestHandler = async (request, res) => {
  const config = await loadConfig();
  const { inputFolder, mjmlParsingOptions, sendTestOptions, fillFakeMetaData } =
    config;

  const params: Params = request.body;
  const { email, locale, to, fillFakeMetaData: fillFakeMetaDataParam } = params;

  const filePath = path.resolve(
    getPathConfig(),
    "..",
    inputFolder,
    email,
    "index.html",
  );

  const mjmlTemplate = fs.readFileSync(filePath, "utf-8");

  let html = await inputOutputHtml({
    inputHtml: mjmlTemplate,
    variables: VARIABLES_LOADER.loadAll({ config, locale }, email),
    templateOptions: config.templateOptions,
    mjmlParsingOptions,
    isTextVersion: false,
  });

  if (fillFakeMetaDataParam) {
    if (!fillFakeMetaData) {
      res
        .status(400)
        .setHeader("Content-Type", "application/json; charset=utf-8")
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
      email,
    );
    html = fillFakeMetaData(html, fakeMetadata);
  }

  let message;
  let code = 400;

  if (!sendTestOptions) {
    message = "cannot send test email because sendTestOptions is null";
  } else {
    // send email
    try {
      const res = await sendTestEmail(
        {
          ...sendTestOptions,
          to,
        },
        html,
      );
      code = 200;
      message = res;
    } catch (err) {
      message = err;
      code = 400;
    }
  }

  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(message);
};
