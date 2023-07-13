import { MJMLParsingOptions } from "mjml-core";
export interface Config {
  inputFolder: string; // default input
  outputFolder: string; // default output
  textVersion?: (emailName: string, locale: string) => string;
  templateOptions?: {
    engine: SupportedEngine;
    // engineRoot will be handlebars,etc etc...
    prepareEngine: (engineRoot: unknown) => void;
  };
  locales: string[]; // default ["en"]
  mjmlParsingOptions?: MJMLParsingOptions;
}

export type SupportedEngine = "eta" | "handlebars";
