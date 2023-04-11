import { RouteHandler } from "fastify";
import { loadConfig } from "../utils";
import fs from "fs";
import { inputOutputHtml } from "../lib/inputOutputHtml";
import loadVariables from "../lib/loadVariables";
import { inject } from "../lib/injectWebSocketNodeScript";

export const handler: RouteHandler = async (request, reply) => {
  const config = await loadConfig();
  const { inputFolder } = config;
  const email: string = (request.params as any).email;
  const locale: string = (request.params as any).locale;

  const mjmlTemplate = fs.readFileSync(
    `${inputFolder}/${email}/index${config.templateSuffix}`,
    "utf-8"
  );

  const html = await inputOutputHtml({
    inputHtml: mjmlTemplate,
    variables: loadVariables({ config, emailName: email, locale }),
    templateOptions: config.templateOptions,
  });

  const htmlWithWebsocketScript = inject(html);

  reply.header("content-type", "text/html");
  reply.send(htmlWithWebsocketScript);
};
