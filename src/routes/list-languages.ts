import { RouteHandler } from "fastify";
import { loadConfig } from "../utils";
import path from "path";

export const handler: RouteHandler = async (request, reply) => {
  const { locales } = await loadConfig();
  const email: string = (request.params as any).email;

  /** this is a FEATURE
  if (locales.length === 1) {
    // single language so we redirect to /[locale]
    const locale = locales[0];
    reply.redirect(`/input/${email}/${locale}`);
  } */

  let list: { locale: string; url: string }[] = [];
  locales.forEach((locale) => {
    list.push({ locale, url: `${email}/${locale}/index.html` });
  });

  const pathView = path.join(__dirname, "../pages/email-variants.html");

  reply.view(pathView, { list });
};
