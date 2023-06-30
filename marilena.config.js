/**
 * this is an example for a config file. Project use this under development
 */

module.exports = {
  inputFolder: "input",
  outputFolder: "output",
  textVersion: (emailName, locale) => `${emailName}_text_version-${locale}.txt`,
  locales: ["it"],
  templateOptions: {
    engine: "eta",
    variablesType: "yml",
    prepareEngine: (eta) => {
      eta.configure({
        views: require("path").join(process.cwd(), "input"),
      });
    },
  },
  mjmlParsingOptions: {
    keepComments: false,
  },
};
