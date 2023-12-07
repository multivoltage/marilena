import type { SupportedEngine } from "./types";

export const FILE_NAME_COMMON_VARIABLES = "common";
export const FILE_NAME_EMAIL_VARIABLES = "variables";
export const FILE_NAME_EMAIL_METADATA = "metadata";

export const EVENT_NAME_NEED_REFRESH_WEBSOCKET = "need_refresh";

export const CONFIG_FILE_NAME = "marilena.config.mjs";
export const SERVER_PORT = 8080 + 1; // use +1 during migration to vite
export const SUPPORTED_ENGINES: Array<SupportedEngine> = ["eta", "handlebars"];
