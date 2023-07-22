import { RouteHandler } from "fastify";
import { getPathConfig, loadConfig } from "../../utils";
import fs from "fs";
import { inputOutputHtml } from "../../lib/inputOutputHtml";
import { VARIABLES_LOADER } from "../../lib/loadVariables";
import path from "path";

export const handler: RouteHandler = async (request, reply) => {
  const config = await loadConfig();
  const { inputFolder, mjmlParsingOptions } = config;
  const email: string = (request.params as any).email;
  const locale: string = (request.params as any).locale;

  const filePath = path.resolve(
    getPathConfig(),
    "..",
    inputFolder,
    email,
    "index.html",
  );

  const mjmlTemplate = fs.readFileSync(filePath, "utf-8");

  const html = await inputOutputHtml({
    inputHtml: mjmlTemplate,
    variables: VARIABLES_LOADER.loadAll({ config, locale }, email),
    templateOptions: config.templateOptions,
    mjmlParsingOptions,
    isTextVersion: false,
  });

  reply.header("content-type", "text/html");
  reply.send(html);
};
