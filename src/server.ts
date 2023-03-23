import fastify from "fastify";
import fastifyView from "@fastify/view";
import eta from "eta";
import { loadConfig } from "./utils";
import { handler as homeHandler } from "./routes/home";
import { handler as emailLangVariants } from "./routes/list-languages";
import { handler as emailHandler } from "./routes/email";

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
  server.get("/", homeHandler);

  // render list of locales for 1 email
  server.get(`/${inputFolder}/:email`, emailLangVariants);

  // render 1 email for 1 language
  server.get(`/${inputFolder}/:email/:locale`, emailHandler);

  // inject config on each endpoint
  // server.addHook("onRequest", (request, reply, done) => {
  //   const ciccio = 3;
  //   (request.params as any).config = 3;
  //   done();
  // });

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
