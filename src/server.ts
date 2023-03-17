import fastify from "fastify";
import fastifyView from "@fastify/view";
import eta from "eta";
import fs from "fs";
import path from "path";
import mjml2html from "mjml";
import { loadConfig } from "./utils";

const config = loadConfig();

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
  const inputFolderPath = path.join("input");
  let list: string[];
  try {
    list = fs.readdirSync(inputFolderPath);
  } catch {
    list = [];
  }

  reply.view("/src/pages/email-list.html", { list });
});

server.get("/input/:email", (request, reply) => {
  const email = (request.params as any).email;

  const mjmlTemplate = fs.readFileSync(`input/${email}`, "utf-8"); // => load mjml file
  const mjmlTenplateWithVars = eta.render(mjmlTemplate, {});
  const html = mjml2html(mjmlTenplateWithVars).html;

  reply.header("content-type", "text/html");
  reply.send(html);
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
