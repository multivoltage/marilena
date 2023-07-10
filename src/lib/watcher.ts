import watch from "node-watch";
import path from "path";
import {
  CONFIG_FILE_NAME,
  FILE_NAME_COMMON_VARIABLES,
  FILE_NAME_EMAIL_VARIABLES,
} from "../const";
import { Config } from "../types";
import { getPathConfig } from "../utils";

interface Callbacks {
  handleEditVariables: (emailName: string, locale?: string) => void;
  handleEmailChange: (emailName: string) => void;
  handleEditConfig: (emailName: string) => void;
  handleEditCss: (emailName: string) => void;
}

export const setupWatcher = function (config: Config, callbacks: Callbacks) {
  const { inputFolder } = config;

  const regex = new RegExp(`.*(.json|.yml|.html|.css|.eta|.hbs)`);
  const pathConfig = getPathConfig();
  const inputFolderPath = path.resolve(getPathConfig(), "..", inputFolder);

  return watch(
    [inputFolderPath, pathConfig],
    { recursive: true, filter: regex },
    function (evt, name) {
      if (evt === "update") {
        const parts = name.split("/");
        const emailName = parts[1];

        if (name.endsWith(CONFIG_FILE_NAME)) {
          callbacks.handleEditConfig(emailName);
        } else if (
          name.endsWith(`${FILE_NAME_EMAIL_VARIABLES}.json`) ||
          name.endsWith(`${FILE_NAME_EMAIL_VARIABLES}.yml`)
        ) {
          // chnged email variables
          const locale = parts[2];
          callbacks.handleEditVariables(emailName, locale);
        } else if (name.endsWith(".html")) {
          // changed email template
          callbacks.handleEmailChange(emailName);
        } else if (
          name.startsWith(
            path.join(inputFolder, `${FILE_NAME_COMMON_VARIABLES}`),
          )
        ) {
          // changed common variables
          callbacks.handleEditVariables(emailName);
        } else if (name.endsWith(".css")) {
          // changed css
          callbacks.handleEditCss(emailName);
        }
      }
    },
  );
};
