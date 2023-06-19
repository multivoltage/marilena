/**
 * this is an example for a config file. Project use this under development
 */
var path = require("path");

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
        views: path.join(process.cwd(), "input"),
      });
      eta.templates.define("mypartial", eta.compile("PARTIAL SPEAKING"));
    },
  },
  mjmlParsingOptions: {
    keepComments: false,
  },
};
