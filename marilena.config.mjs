import path from "path";
/**
 * this is of config file. Is used only inside playground
 */

/** @type {import('.').Config} */
export default {
  inputFolder: "playground/input",
  outputFolder: "playground/output",
  textVersion: (emailName, locale) => `${emailName}_text_version-${locale}.txt`,
  locales: ["it", "en"],
  templateOptions: {
    engine: "eta",
    prepareEngine: (eta) => {
      eta.configure({
        views: path.join(process.cwd(), "plsayground/input"),
      });
    },
  },
  mjmlParsingOptions: {
    keepComments: false,
  },
};