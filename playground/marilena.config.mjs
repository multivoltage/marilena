import path from "path";
/**
 * this is of config file. Is used only inside playground
 */

/** @type {import('../').Config} */
export default {
  inputFolder: "./input",
  outputFolder: "./output",
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
};
