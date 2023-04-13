import { RouteHandler } from "fastify";
import path from "path";
import { loadConfig } from "../utils";
import fs from "fs";

export const handler: RouteHandler = async (request, reply) => {
  const { inputFolder } = await loadConfig();
  const inputFolderPath = path.join(inputFolder);
  let list: { emailName: string; url: string }[] = [];

  try {
    const folders = fs.readdirSync(inputFolderPath, { withFileTypes: true });
    list = folders
      .filter((f) => f.isDirectory())
      .map((folder) => ({
        emailName: folder.name,
        url: path.join(inputFolderPath, folder.name),
      }));
  } catch {}

  const pathView = path.join(__dirname, "../pages/email-list.html");

  reply.view(pathView, { list });
};
