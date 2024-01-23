import fs from "node:fs";
import path from "node:path";
import { CONFIG_FILE_NAME } from "../const.js";

const config = `
import path from "node:path";
import nodemailer from 'nodemailer'
/**
 * this is of config file. Is used only inside playground
 */

/** @type {import('marilena/dist/src/types').UserConfig} */
export default {
  inputFolder: "./input",
  outputFolder: "./output",
  locales: ["en"],
  templateOptions: {
    engine: "eta",
    prepareEngine: (eta) => {
      eta.configure({
        views: path.join(process.cwd(), "example/input"),
      });
    },
  },
  mjmlParsingOptions: {
    keepComments: false,
  },
  sendTestOptions: {
    to: process.env.SEND_TEST_OPTION_TO,
    from: process.env.SEND_TEST_OPTION_FROM, // only valid and registered alias are working with SES
    createTransport: () =>
      nodemailer.createTransport({
        SES: {
          ses: new aws.SES({
            apiVersion: "2010-12-01",
            region: "us-east-1",
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY,
              secretAccessKey: process.env.AWS_SECRET,
            },
          }),
          aws,
        },
      }),
  },
};
`;
export default function (fromPath: string) {
  const pathFile = path.join(fromPath, CONFIG_FILE_NAME);
  fs.writeFileSync(pathFile, config, "utf-8");
}
