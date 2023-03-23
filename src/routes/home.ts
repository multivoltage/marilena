import { RouteHandler } from "fastify";
import path from "path";
import { loadConfig } from "../utils";
import fs from "fs";

export const handler: RouteHandler = async (request, reply) => {
  const { inputFolder } = await loadConfig();
  const inputFolderPath = path.join(inputFolder);
  let list: { emailName: string; url: string }[] = [];

  try {
    const folders = fs.readdirSync(inputFolderPath);
    list = folders.map((folder) => ({
      emailName: folder,
      url: path.join(inputFolderPath, folder),
    }));
  } catch {}

  reply.view("/src/pages/email-list.html", { list });
};
