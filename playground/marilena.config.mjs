import path from "path";
import * as aws from "@aws-sdk/client-ses";
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
    provider: "aws-ses",
    to: "diego.tonini93@gmail.com",
    from: "noreply@custom_domain.com", // only valid and registered alias are working with SES
    ses: () =>
      new aws.SES({
        apiVersion: "2010-12-01",
        region: "us-east-1",
        credentials: {
          accessKeyId: "...",
          secretAccessKey: "...",
        },
      }),
  },
};
