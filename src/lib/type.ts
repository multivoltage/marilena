import { FastifyViewOptions } from "@fastify/view";

export interface Config {
  templateSuffix: string; // .html .eta .handlebars ...etc
  inputFolder: string; // default input
  outputFolder: string; // default output
  templateOptions?: {
    engine: keyof FastifyViewOptions["engine"];
    variablesType: "json"; // json or yml in the future
  };
  locales: string[]; // default ["en"]
}
