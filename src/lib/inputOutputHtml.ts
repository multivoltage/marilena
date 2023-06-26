import mjml2html from "mjml";
import { Config } from "../types";
import eta from "eta";
// import handlebars from "handlebars";
import logger from "node-color-log";
import { CONFIG_FILE_NAME } from "../const";
import { stripHtml } from "string-strip-html";

const isTextExecution = process.env.NODE_ENV === "test";
// this method should take soem html, add variables, convert with mjml and return html

interface Options {
  templateOptions?: Config["templateOptions"];
  inputHtml: string;
  variables: object;
  mjmlParsingOptions: Config["mjmlParsingOptions"];
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

    const { prepareEngine } = templateOptions;
    if (!prepareEngine) {
      logger.error(
        `templateOptions options is defined, but prepareEngine is null. Please check method under ${CONFIG_FILE_NAME}`
      );
    }

    switch (templateOptions.engine) {
      case "eta": {
        if (!!prepareEngine) {
          prepareEngine(eta);
        }
        return eta.render(inputHtml, variables);
      }

      case "handlebars": {
        const handlebars = await import("handlebars");
        if (!!prepareEngine) {
          prepareEngine(handlebars);
        }
        return handlebars.compile(inputHtml)(variables);
      }

      default: {
        logger.error(
          `engine ${templateOptions.engine} not supported, so template will be parsed without fill variables. Please contribute to the repo :)`
        );
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

  const html = mjml2html(mjmlTenplateWithVars, mjmlParsingOptions).html;
  return html;
}
