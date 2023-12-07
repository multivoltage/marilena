import { RouteHandler } from "fastify";
import { getPathConfig, loadConfig } from "../utils.js";
import fs from "fs";
import { inputOutputHtml } from "../lib/inputOutputHtml.js";
import { VARIABLES_LOADER } from "../lib/loadVariables.js";
import { sendTestEmail } from "../lib/send-test-email.js";
import path from "path";

export const handler: RouteHandler = async (request, reply) => {
  const config = await loadConfig();
  const { inputFolder, mjmlParsingOptions, sendTestOptions } = config;
  const email: string = (request.params as any).email;
  const locale: string = (request.params as any).locale;

  const body: { to: string } = JSON.parse(request.body as string);

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

  let message;
  let code = 400;

  if (!sendTestOptions) {
    message = "cannot send test email because sendTestOptions is null";
  } else {
    // send email
    try {
      const res = await sendTestEmail(
        {
          ...sendTestOptions,
          to: body.to,
        },
        html,
      );
      code = 200;
      message = res;
    } catch (err) {
      message = err;
      code = 400;
    }
  }

  reply
    .code(code)
    .header("Content-Type", "application/json; charset=utf-8")
    .send(message);
};
