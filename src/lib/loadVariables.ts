import path from "node:path";
import fs from "node:fs";
import { CoreConfig } from "../types";
import {
  FILE_NAME_COMMON_VARIABLES,
  FILE_NAME_EMAIL_METADATA,
  FILE_NAME_EMAIL_VARIABLES,
} from "../const.js";
import logger from "node-color-log";
import yaml from "js-yaml";
import { getPathConfig } from "../utils.js";

interface Options {
  config: CoreConfig;
  locale: string;
}

function loadCommon(options: Options): object {
  const { locale, config } = options;
  const { inputFolder } = config;
  const inputFolderPath = path.resolve(getPathConfig(), "..", inputFolder);

  try {
    // try to load yml
    return yaml.load(
      fs.readFileSync(
        path.join(
          inputFolderPath,
          `${FILE_NAME_COMMON_VARIABLES}-${locale}.yml`,
        ),
        "utf-8",
      ),
    ) as object;
  } catch (e) {
    try {
      // try to load json
      const vars = JSON.parse(
        fs.readFileSync(
          path.join(
            inputFolderPath,
            `${FILE_NAME_COMMON_VARIABLES}-${locale}.json`,
          ),
          "utf-8",
        ),
      );
      return vars;
    } catch {
      logger.error(
        `cannot load common variables for "${locale}" locale.
        Please create file "${FILE_NAME_COMMON_VARIABLES}-${locale}" with .json or .yml extesnion file under ${inputFolderPath}.
        Using empty variables now.`,
      );
      return {};
    }
  }
}

function loadSingle(options: Options, emailName: string): object {
  const { config, locale } = options;
  const { inputFolder } = config;
  const inputFolderPath = path.resolve(getPathConfig(), "..", inputFolder);
  let vars: object = {};
  let founded = false;

  try {
    const ymlVarisblaes = yaml.load(
      fs.readFileSync(
        path.join(
          inputFolderPath,
          emailName,
          locale,
          `${FILE_NAME_EMAIL_VARIABLES}.yml`,
        ),
        "utf-8",
      ),
    ) as object;
    vars = { ...vars, ...ymlVarisblaes };
    founded = true;
  } catch (e) {}

  try {
    const jsonVariables = JSON.parse(
      fs.readFileSync(
        path.join(
          inputFolderPath,
          emailName,
          locale,
          `${FILE_NAME_EMAIL_VARIABLES}.json`,
        ),
        "utf-8",
      ),
    );
    vars = { ...vars, ...jsonVariables };
    founded = true;
  } catch (e) {}

  if (!founded) {
    logger.error(
      `cannot load variables for email "${emailName}" ${locale}. Please create file "${FILE_NAME_EMAIL_VARIABLES}" with .json or .yml extension file under ${inputFolderPath}/${emailName}/${locale}`,
    );
  }

  return vars;
}

function loadMetadata(options: Options, emailName: string): object {
  const { config, locale } = options;
  const { inputFolder } = config;
  const inputFolderPath = path.resolve(getPathConfig(), "..", inputFolder);
  let vars: object = {};
  let founded = false;

  try {
    const ymlVarisblaes = yaml.load(
      fs.readFileSync(
        path.join(
          inputFolderPath,
          emailName,
          locale,
          `${FILE_NAME_EMAIL_METADATA}.yml`,
        ),
        "utf-8",
      ),
    ) as object;
    vars = { ...vars, ...ymlVarisblaes };
    founded = true;
  } catch (e) {}

  try {
    const jsonVariables = JSON.parse(
      fs.readFileSync(
        path.join(
          inputFolderPath,
          emailName,
          locale,
          `${FILE_NAME_EMAIL_METADATA}.json`,
        ),
        "utf-8",
      ),
    );
    vars = { ...vars, ...jsonVariables };
    founded = true;
  } catch (e) {}

  if (!founded) {
    logger.error(
      `cannot load metadata for email "${emailName}" ${locale}. Please create file "${FILE_NAME_EMAIL_METADATA}" with .json or .yml extension file under ${inputFolderPath}/${emailName}/${locale}`,
    );
  }

  return vars;
}

export const VARIABLES_LOADER = {
  loadCommon,
  loadSingle,
  loadAll: function (options: Options, emailName?: string) {
    return {
      ...loadCommon(options),
      ...loadSingle(options, emailName as string),
    };
  },
  loadMetadata,
};
