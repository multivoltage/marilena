import mjml2html from "mjml";
import { Config } from "../types";
import logger from "node-color-log";
import { CONFIG_FILE_NAME } from "../const";
import { stripHtml } from "string-strip-html";

const isTextExecution = process.env.NODE_ENV === "test";

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
      throw new Error(
        `templateOptions options is defined, but prepareEngine is null. Please check method under ${CONFIG_FILE_NAME}`,
      );
    }

    switch (templateOptions.engine) {
      case "eta": {
        const { Eta } = await import("eta");
        const eta = new Eta();
        prepareEngine(eta);
        // @ts-ignore
        return await eta.renderStringAsync(inputHtml, variables);
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
          `engine ${templateOptions.engine} not supported, so template will be parsed without fill variables. Please contribute to the repo :)`,
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
