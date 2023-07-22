import { RouteHandler } from "fastify";
import path from "path";

export const handler: RouteHandler = async (request, reply) => {
  const email: string = (request.params as any).email;
  const locale: string = (request.params as any).locale;

  const pathView = path.join("../pages/email.html");
  reply.view(pathView, { url: `/api/getHtmlEmail/${email}/${locale}` });
};
