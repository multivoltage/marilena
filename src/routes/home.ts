import { RouteHandler } from "fastify";
import path from "path";
import { isEmailDirectory, loadConfig } from "../utils";
import fs from "fs";

export const handler: RouteHandler = async (request, reply) => {
  const { inputFolder } = await loadConfig();
  const inputFolderPath = path.join(inputFolder);
  let list: { emailName: string; url: string }[] = [];

  try {
    const folders = fs.readdirSync(inputFolderPath, { withFileTypes: true });
    list = folders
      .filter((f) => isEmailDirectory(inputFolder, f))
      .map((folder) => ({
        emailName: folder.name,
        url: path.join(inputFolderPath, folder.name),
      }));
  } catch {}

  console.log("xxx", list);
  const pathView = path.join(__dirname, "../pages/email-list.html");

  reply.view(pathView, { list });
};
