import { RequestHandler } from "express";
import path from "path";
import { getPathConfig, isEmailDirectory, loadConfig } from "../utils";
import fs from "fs";

export type Response = Array<{ emailName: string }>;

export const handler: RequestHandler = async (_, res) => {
  const { inputFolder } = await loadConfig();
  const inputFolderPath = path.resolve(getPathConfig(), "..", inputFolder);

  let list: Response = [];

  try {
    const folders = fs.readdirSync(inputFolderPath, { withFileTypes: true });

    list = folders
      .filter((f) => isEmailDirectory(inputFolderPath, f))
      .map((folder) => ({
        emailName: folder.name,
      }));
  } catch {}

  res.send(list);
};
