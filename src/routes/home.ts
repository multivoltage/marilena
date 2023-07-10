import { RouteHandler } from "fastify";
import path from "path";
import { getPathConfig, isEmailDirectory, loadConfig } from "../utils";
import fs from "fs";

export const handler: RouteHandler = async (request, reply) => {
  const { inputFolder } = await loadConfig();
  const inputFolderPath = path.resolve(getPathConfig(), "..", inputFolder);

  let list: { emailName: string; url: string }[] = [];

  try {
    const folders = fs.readdirSync(inputFolderPath, { withFileTypes: true });

    list = folders
      .filter((f) => isEmailDirectory(inputFolderPath, f))
      .map((folder) => ({
        emailName: folder.name,
        url: path.join(folder.name),
      }));
  } catch {}

  const pathView = path.join("../pages/email-list.html");

  reply.view(pathView, { list });
};
