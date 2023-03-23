import watch from "node-watch";
import path from "path";
import {
  EVENT_NAME_NEED_REFRESH_WEBSOCKET,
  FILE_NAME_COMMON_VARIABLES,
  FILE_NAME_EMAIL_VARIABLES,
} from "../const";
import { Config } from "./type";

interface Callbacks {
  handleEditVariables: (emailName: string, locale: string) => void;
}

export const setupWatcher = function (
  config: Config,
  websocket: WebSocket | undefined,
  callbacks: Callbacks
) {
  const { inputFolder } = config;

  return watch(
    path.join(inputFolder),
    { recursive: true, filter: /\.json$/ },
    function (evt, name) {
      // example input/buy/it/variables.json
      if (evt === "update") {
        const parts = name.split("/");
        const emailName = parts[1];
        const locale = parts[2];
        if (name.endsWith(`${FILE_NAME_EMAIL_VARIABLES}.json`)) {
          // chnged variables
          callbacks.handleEditVariables(emailName, locale);
        }
        if (name.endsWith(`${FILE_NAME_COMMON_VARIABLES}.json`)) {
          // TODO
        }
      }
    }
  );
};
