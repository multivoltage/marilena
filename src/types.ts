import { MJMLParsingOptions } from "mjml-core";
export interface UserConfig {
  inputFolder?: string; // default input
  outputFolder?: string; // default output
  htmlVersion?: (emailName: string, locale: string) => string;
  textVersion?: (emailName: string, locale: string) => string;
  templateOptions?: {
    engine: SupportedEngine;
    // engineRoot will be handlebars,etc etc...
    prepareEngine: (engineRoot: unknown) => void;
  };
  locales?: string[]; // default ["en"]
  mjmlParsingOptions?: MJMLParsingOptions;
}

export type SupportedEngine = "eta" | "handlebars";

// internal use only
export type CoreConfig = UserConfig &
  Required<Pick<UserConfig, "inputFolder" | "outputFolder" | "locales">>;
