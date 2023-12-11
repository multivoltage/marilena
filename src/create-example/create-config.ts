import fs from "node:fs";
import path from "node:path";
import { CONFIG_FILE_NAME } from "../const.js";

const config = `
import path from "node:path";
/**
 * this is of config file. Is used only inside playground
 */

/** @type {import('marilena').UserConfig} */
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
};
`;
export default function (fromPath: string) {
  const pathFile = path.join(fromPath, CONFIG_FILE_NAME);
  fs.writeFileSync(pathFile, config, "utf-8");
}
