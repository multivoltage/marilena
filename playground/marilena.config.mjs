import path from "path";
import * as aws from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
/**
 * this is of config file. Is used only inside playground
 */

/** @type {import('../src/types').UserConfig} */
export default {
  textVersion: (emailName, locale) => `${emailName}_text_version-${locale}.txt`,
  locales: ["it", "en"],
  templateOptions: {
    engine: "eta",
    prepareEngine: (eta) => {
      eta.configure({
        views: path.join(process.cwd(), "playground/input"),
      });
    },
  },
  mjmlParsingOptions: {
    keepComments: false,
  },
  sendTestOptions: {
    to: "diego.tonini93@gmail.com",
    from: "noreply@conio.com", // only valid and registered alias are working with SES
    createTransport: () =>
      nodemailer.createTransport({
        SES: {
          ses: new aws.SES({
            apiVersion: "2010-12-01",
            region: "us-east-1",
            credentials: {
              accessKeyId: "...",
              secretAccessKey: "...",
            },
          }),
          aws,
        },
      }),
  },
};
