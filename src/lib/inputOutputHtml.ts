import mjml2html from "mjml";
import { Config } from "./type";
import eta from "eta";

const isTextExecution = process.env.NODE_ENV === "test";
// this method should take soem html, add variables, convert with mjml and return html

interface Options {
  inputHtml: string;
  variables?: object;
}
export function inputOutputHtml({ inputHtml, variables }: Options): string {
  const mjmlTenplateWithVars =
    typeof variables !== "undefined"
      ? eta.render(inputHtml, variables) // eta is only one case. TODO: handle different template
      : inputHtml;

  if (isTextExecution) {
    return mjmlTenplateWithVars;
  }

  const html = mjml2html(mjmlTenplateWithVars).html;
  return html;
}
