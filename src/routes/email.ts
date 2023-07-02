import { RouteHandler } from "fastify";
import { loadConfig } from "../utils";
import fs from "fs";
import { inputOutputHtml } from "../lib/inputOutputHtml";
import { VARIABLES_LOADER } from "../lib/loadVariables";
import { inject } from "../lib/injectWebSocketNodeScript";

export const handler: RouteHandler = async (request, reply) => {
  const config = await loadConfig();
  const { inputFolder, mjmlParsingOptions } = config;
  const email: string = (request.params as any).email;
  const locale: string = (request.params as any).locale;

  const mjmlTemplate = fs.readFileSync(
    `${inputFolder}/${email}/index.html`,
    "utf-8"
  );

  const html = await inputOutputHtml({
    inputHtml: mjmlTemplate,
    variables: VARIABLES_LOADER.loadAll({ config, locale }, email),
    templateOptions: config.templateOptions,
    mjmlParsingOptions,
    isTextVersion: false,
  });

  const htmlWithWebsocketScript = inject(html);

  reply.header("content-type", "text/html");
  reply.send(htmlWithWebsocketScript);
};
