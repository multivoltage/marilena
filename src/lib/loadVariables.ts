import path from "path";
import fs from "fs";
import { Config } from "../types";
import { FILE_NAME_EMAIL_VARIABLES } from "../const";

interface Options {
  config: Config;
  emailName: string;
  locale: string;
}

export default function (options: Options): object {
  const { inputFolder } = options.config;

  let emailVariables: object = {};
  let common: object = {};

  try {
    emailVariables = JSON.parse(
      fs.readFileSync(
        path.join(
          inputFolder,
          options.emailName,
          options.locale,
          `${FILE_NAME_EMAIL_VARIABLES}.json` // in the future also yml file with yml-js
        ),
        "utf-8"
      )
    );
  } catch (e) {
    console.error(
      `error loading emailVariables for email ${options.emailName} ${options.locale}`
    );
  }

  return {
    ...common,
    ...emailVariables,
  };
}
