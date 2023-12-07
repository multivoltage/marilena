import { loadConfig } from "../utils.js";
import { RequestHandler } from "express";

export type Response = Array<{ locale: string }>;

export const handler: RequestHandler = async (request, res) => {
  const { locales } = await loadConfig();

  let list: Response = [];
  locales.forEach((locale) => {
    list.push({ locale });
  });

  res.send(list);
};
