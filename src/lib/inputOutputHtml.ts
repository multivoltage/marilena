import mjml2html from "mjml";
import { CoreConfig } from "../types";
import { CONFIG_FILE_NAME, SUPPORTED_ENGINES } from "../const.js";
import { stripHtml } from "string-strip-html";
import { compile } from "sass";
import { getPathConfig, loadConfig } from "../utils.js";
import path from "node:path";
import fs from "node:fs";
import * as cheerio from "cheerio";

const isTextExecution = process.env.NODE_ENV === "test";

interface Options {
  templateOptions?: CoreConfig["templateOptions"];
  inputHtml: string;
  variables: object;
  mjmlParsingOptions: CoreConfig["mjmlParsingOptions"];
  isTextVersion: boolean;
}
export async function inputOutputHtml({
  inputHtml,
  variables,
  templateOptions,
  mjmlParsingOptions,
  isTextVersion,
}: Options): Promise<string> {
  async function rendereWithVars() {
    if (!templateOptions) {
      return inputHtml;
    }

    const { prepareEngine, engine } = templateOptions;
    if (!prepareEngine) {
      throw new Error(
        `templateOptions options is defined, but prepareEngine is null. Please check method under ${CONFIG_FILE_NAME}`,
      );
    }

    if (!SUPPORTED_ENGINES.includes(engine)) {
      throw new Error(
        `engine ${engine} not supported. Options available are [${SUPPORTED_ENGINES}]. Please contribute to the repo :)`,
      );
    }

    switch (engine) {
      case "eta": {
        const { Eta } = await import("eta");
        const eta = new Eta();
        prepareEngine(eta);
        // @ts-ignore
        return await eta.renderStringAsync(inputHtml, variables);
      }

      case "handlebars": {
        const handlebars = await import("handlebars");
        prepareEngine(handlebars);
        return handlebars.compile(inputHtml)(variables);
      }

      default: {
        return inputHtml;
      }
    }
  }

  const mjmlTenplateWithVars = await rendereWithVars();

  if (isTextVersion) {
    return stripHtml(mjmlTenplateWithVars).result;
  }

  if (isTextExecution) {
    return mjmlTenplateWithVars;
  }

  let html = mjml2html(mjmlTenplateWithVars, mjmlParsingOptions).html;

  const $ = cheerio.load(html, {
    xml: {
      xmlMode: false,
    },
  });

  // add SCSS
  const { inputFolder } = await loadConfig();
  const scssFilePath = path.resolve(
    getPathConfig(),
    "..",
    inputFolder,
    "styles.scss",
  );

  let scssFounded = fs.existsSync(scssFilePath);
  if (scssFounded) {
    const scssCompiled = compile(scssFilePath).css;
    // we add compiled scss into <head> tag
    $("head").append(`<style>${scssCompiled}</style>`);
  }

  html = $.html();

  return html;
}
