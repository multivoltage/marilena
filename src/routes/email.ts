import { RouteHandler } from "fastify";
import { loadConfig } from "../utils";
import fs from "fs";
import { inputOutputHtml } from "../lib/inputOutputHtml";
import loadVariables from "../lib/loadVariables";

export const handler: RouteHandler = async (request, reply) => {
  const config = await loadConfig();
  const { inputFolder } = config;
  const email: string = (request.params as any).email;
  const locale: string = (request.params as any).locale;

  const mjmlTemplate = fs.readFileSync(
    `${inputFolder}/${email}/index.html`,
    "utf-8"
  );

  const html = inputOutputHtml({
    inputHtml: mjmlTemplate,
    variables: loadVariables({ config, emailName: email, locale }),
    templateOptions: config.templateOptions,
  });

  reply.header("content-type", "text/html");
  reply.send(html);
};
