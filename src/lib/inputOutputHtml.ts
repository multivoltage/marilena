import mjml2html from "mjml";
import { Config } from "../types";
import eta from "eta";
import logger from "node-color-log";

const isTextExecution = process.env.NODE_ENV === "test";
// this method should take soem html, add variables, convert with mjml and return html

interface Options {
  templateOptions?: Config["templateOptions"];
  inputHtml: string;
  variables: object;
}
export function inputOutputHtml({
  inputHtml,
  variables,
  templateOptions,
}: Options): string {
  function rendereWithVars() {
    if (!templateOptions) {
      return inputHtml;
    }

    switch (templateOptions.engine) {
      case "eta":
        return eta.render(inputHtml, variables);
      default: {
        logger.info(
          `engine ${templateOptions.engine} not supported. Please contribute to the repo :)`
        );
        logger.info("template will be parsed without fill variables");
        return inputHtml;
      }
    }
  }

  const mjmlTenplateWithVars = rendereWithVars();

  if (isTextExecution) {
    return mjmlTenplateWithVars;
  }

  const html = mjml2html(mjmlTenplateWithVars).html;
  return html;
}
