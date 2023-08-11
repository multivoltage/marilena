import { SendTestOptions } from "../types";

export function sendTestEmail(options: SendTestOptions, html: string) {
  const { from, to, createTransport } = options;

  return createTransport().sendMail({
    from,
    to,
    subject: "Test",
    html,
  });
}
