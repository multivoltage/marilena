import path from "path";
import fs from "fs";
import { Config } from "../types";
import {
  FILE_NAME_COMMON_VARIABLES,
  FILE_NAME_EMAIL_VARIABLES,
} from "../const";
import logger from "node-color-log";

interface Options {
  config: Config;
  emailName: string;
  locale: string;
}

export default function (options: Options): object {
  const { inputFolder } = options.config;
  const locale = options.locale;

  let emailVariables: object = {};
  let common: object = {};

  try {
    common = JSON.parse(
      fs.readFileSync(
        path.join(inputFolder, `${FILE_NAME_COMMON_VARIABLES}-${locale}.json`),
        "utf-8"
      )
    );
  } catch (e) {
    logger.error(
      `cannot loading common variables for email ${options.emailName} ${options.locale}. Please create ${FILE_NAME_COMMON_VARIABLES}-${locale} file under ${inputFolder}`
    );
  }

  try {
    emailVariables = JSON.parse(
      fs.readFileSync(
        path.join(
          inputFolder,
          options.emailName,
          locale,
          `${FILE_NAME_EMAIL_VARIABLES}.json` // in the future also yml file with yml-js
        ),
        "utf-8"
      )
    );
  } catch (e) {
    logger.error(
      `cannot loading variables for email ${options.emailName} ${options.locale}`
    );
  }

  return {
    ...common,
    ...emailVariables,
  };
}
