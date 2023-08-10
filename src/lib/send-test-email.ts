import nodemailer from "nodemailer";
import * as aws from "@aws-sdk/client-ses";
import { SendTestOptions } from "../types";

export function sendTestEmail(options: SendTestOptions, html: string) {
  if (options.provider !== "aws-ses") {
    throw new Error(
      `provider ${options.provider} not supported for send a test email`,
    );
  }

  // create Nodemailer SES transporter
  let transporter = nodemailer.createTransport({
    SES: { ses: options.ses(), aws },
  });

  return transporter.sendMail({
    from: options.from,
    to: options.to,
    subject: "Test",
    html,
  });
}
