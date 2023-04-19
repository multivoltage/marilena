import { FastifyViewOptions } from "@fastify/view";
import { MJMLParsingOptions } from "mjml-core";
export interface Config {
  templateSuffix: string; // .html .eta .handlebars ...etc
  inputFolder: string; // default input
  outputFolder: string; // default output
  templateOptions?: {
    engine: "eta" | "handlebars";
    variablesType: "json" | "yml"; // json or yml
    // engineRoot will be handlebars,etc etc...
    prepareEngine: (engineRoot: unknown) => void;
  };
  locales: string[]; // default ["en"]
  mjmlParsingOptions?: MJMLParsingOptions;
}
