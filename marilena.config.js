/**
 * this is of config file. Is used only inside playground
 */

module.exports = {
  inputFolder: "playground/input",
  outputFolder: "playground/output",
  textVersion: (emailName, locale) => `${emailName}_text_version-${locale}.txt`,
  locales: ["it", "en"],
  templateOptions: {
    engine: "eta",
    prepareEngine: (eta) => {
      eta.configure({
        views: require("path").join(process.cwd(), "playground/input"),
      });
    },
  },
  mjmlParsingOptions: {
    keepComments: false,
  },
};
