import path from "path";
import fs from "fs";
import { Config } from "../types";
import {
  FILE_NAME_COMMON_VARIABLES,
  FILE_NAME_EMAIL_VARIABLES,
} from "../const";
import logger from "node-color-log";
import yaml from "js-yaml";

interface Options {
  config: Config;
  emailName: string;
  locale: string;
}

export default function (options: Options): object {
  const { inputFolder, templateOptions } = options.config;
  const locale = options.locale;
  const variablesType = templateOptions?.variablesType || "json";

  let emailVariables: object = {};
  let common: object = {};

  switch (variablesType) {
    case "json": {
      try {
        common = JSON.parse(
          fs.readFileSync(
            path.join(
              inputFolder,
              `${FILE_NAME_COMMON_VARIABLES}-${locale}.json`
            ),
            "utf-8"
          )
        );
      } catch (e) {
        logger.error(e);
        logger.error(
          `cannot load common variables for email ${options.emailName} ${options.locale}. Please create ${FILE_NAME_COMMON_VARIABLES}-${locale}.json file under ${inputFolder}`
        );
      }

      try {
        emailVariables = JSON.parse(
          fs.readFileSync(
            path.join(
              inputFolder,
              options.emailName,
              locale,
              `${FILE_NAME_EMAIL_VARIABLES}.json`
            ),
            "utf-8"
          )
        );
      } catch (e) {
        logger.error(e);
        logger.error(
          `cannot load variables for email ${options.emailName} ${options.locale}. Please create ${FILE_NAME_EMAIL_VARIABLES}.json file under ${inputFolder}/${options.emailName}/${options.locale}`
        );
      }
      break;
    }

    case "yml": {
      try {
        common = yaml.load(
          fs.readFileSync(
            path.join(
              inputFolder,
              `${FILE_NAME_COMMON_VARIABLES}-${locale}.yml`
            ),
            "utf-8"
          )
        ) as object;
      } catch (e) {
        logger.error(e);
        logger.error(
          `cannot load common variables for email ${options.emailName} ${options.locale}. Please create ${FILE_NAME_COMMON_VARIABLES}-${locale}.yml file under ${inputFolder}`
        );
      }

      try {
        emailVariables = yaml.load(
          fs.readFileSync(
            path.join(
              inputFolder,
              options.emailName,
              locale,
              `${FILE_NAME_EMAIL_VARIABLES}.yml`
            ),
            "utf-8"
          )
        ) as object;
      } catch (e) {
        logger.error(e);
        logger.error(
          `cannot load variables for email ${options.emailName} ${options.locale}. Please create ${FILE_NAME_EMAIL_VARIABLES}.yml file under ${inputFolder}/${options.emailName}/${options.locale}`
        );
      }
      break;
    }
  }

  return {
    ...common,
    ...emailVariables,
  };
}
