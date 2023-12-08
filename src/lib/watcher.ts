import watch from "node-watch";
import path from "node:path";
import {
  CONFIG_FILE_NAME,
  FILE_NAME_COMMON_VARIABLES,
  FILE_NAME_EMAIL_VARIABLES,
} from "../const.js";
import { CoreConfig } from "../types";
import { getPathConfig } from "../utils.js";

interface Callbacks {
  handleEditVariables: () => void;
  handleEmailChange: () => void;
  handleEditConfig: () => void;
  handleEditCss: () => void;
}

export const setupWatcher = function (
  config: CoreConfig,
  callbacks: Callbacks,
) {
  const { inputFolder } = config;

  const regex = new RegExp(`.*(.json|.yml|.html|.css|.eta|.hbs)`);
  const pathConfig = getPathConfig();
  const inputFolderPath = path.resolve(getPathConfig(), "..", inputFolder);

  return watch(
    [inputFolderPath, pathConfig],
    { recursive: true, filter: regex },
    function (evt, name) {
      if (evt === "update") {
        const baseName = path.basename(name);

        if (baseName.endsWith(CONFIG_FILE_NAME)) {
          // changed marilena.config.mjs
          callbacks.handleEditConfig();
        } else if (baseName.endsWith(`.json`) || baseName.endsWith(`.yml`)) {
          // chnged email variables
          callbacks.handleEditVariables();
        } else if (baseName.endsWith(".html")) {
          // changed email/partial/layout
          callbacks.handleEmailChange();
        } else if (baseName.endsWith(".css")) {
          // changed css
          callbacks.handleEditCss();
        }
      }
    },
  );
};
