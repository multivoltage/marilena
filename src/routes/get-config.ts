import { CoreConfig } from "../types.js";
import { loadConfig } from "../utils.js";
import { RequestHandler } from "express";

// we use that on client because only primitives can pass in get-config api call
export type SerializedConfig = Pick<
  CoreConfig,
  "inputFolder" | "outputFolder" | "locales" | "sendTestOptions"
>;

export const handler: RequestHandler = async (_, res) => {
  const config = await loadConfig();
  res.send(config);
};
