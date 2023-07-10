import fs from "fs";
import path from "path";
import { CONFIG_FILE_NAME } from "../const";

const config = `
import path from "path";
/**
 * this is of config file. Is used only inside playground
 */

/** @type {import('marilena').Config} */
export default {
  inputFolder: "./example/input",
  outputFolder: "./example/output",
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
