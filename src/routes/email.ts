import { RouteHandler } from "fastify";
import path from "path";
import { loadConfig } from "../utils";

export const handler: RouteHandler = async (request, reply) => {
  const { sendTestOptions } = await loadConfig();
  const email: string = (request.params as any).email;
  const locale: string = (request.params as any).locale;

  const pathView = path.join("../pages/email.html");

  const endpoint_email_content = `/api/getHtmlEmail/${email}/${locale}`;
  const endpoint_send_test_email = `/api/postSendEmail/${email}/${locale}`;
  reply.view(pathView, {
    endpoint_email_content,
    endpoint_send_test_email,
    defaultTo: sendTestOptions?.to,
    email,
    locale,
  });
};
