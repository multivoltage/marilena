import { FastifyViewOptions } from "@fastify/view";
import { MJMLParsingOptions } from "mjml-core";
export interface Config {
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
