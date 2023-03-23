import fastify from "fastify";
import fastifyView from "@fastify/view";
import eta from "eta";
import fs from "fs";
import path from "path";
import mjml2html from "mjml";
import { loadConfig } from "./utils";
import { inputOutputHtml } from "./lib/inputOutputHtml";
import loadVariables from "./lib/loadVariables";

loadConfig().then((config) => {
  const { inputFolder } = config;

  const server = fastify({
    // logger: true,
  });
  server.register(fastifyView, {
    engine: {
      eta,
    },
  });
  // render list of email founded
  server.get("/", async (request, reply) => {
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
  });

  server.get(`/${inputFolder}/:email`, (request, reply) => {
    const email = (request.params as any).email;
    const locales = config.locales;

    /** this is a FEATURE
    if (locales.length === 1) {
      // single language so we redirect to /[locale]
      const locale = locales[0];
      reply.redirect(`/input/${email}/${locale}`);
    } */

    let list: { locale: string; url: string }[] = [];
    locales.forEach((locale) => {
      list.push({ locale, url: `${email}/${locale}` });
    });
    reply.view("/src/pages/email-variants.html", { list });
  });

  server.get(`/${inputFolder}/:email/:locale`, (request, reply) => {
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
  });

  server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("Loaded config:");
    console.log(config);
    console.log(`Server listening at ${address}`);
  });
});
