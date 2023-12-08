import { loadConfig } from "../utils.js";
import { RequestHandler } from "express";

export const handler: RequestHandler = async (_, res) => {
  const config = await loadConfig();
  res.send(config);
};
