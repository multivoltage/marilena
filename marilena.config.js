/**
 * this is an example for a config file. Project use this under development
 */
module.exports = {
  templateSuffix: ".html",
  inputFolder: "input",
  outputFolder: "output",
  locales: ["en"],
  templateOptions: {
    engine: "eta",
    variablesType: "yml",
    prepareEngine: (eta) => {
      eta.templates.define("mypartial", eta.compile("PARTIAL SPEAKING"));
    },
  },
};
