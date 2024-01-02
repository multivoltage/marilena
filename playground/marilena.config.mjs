import path from "path";
import * as aws from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import Handlebars from "handlebars";
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
  fillFakeMetaData: (outputHtml, fakeData) => {
    const template = Handlebars.compile(outputHtml);
    return template(fakeData);
  },
};
