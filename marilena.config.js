const eta = require("eta");

eta.templates.define("mypartial", eta.compile("PARTIAL SPEAKING"));

module.exports = {
  templateSuffix: ".html",
  inputFolder: "input",
  outputFolder: "output",
  locales: ["en"],
  templateOptions: {
    engine: "eta",
    variablesType: "json",
  },
};
