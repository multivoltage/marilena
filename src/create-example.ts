import path from "path";
import fs from "fs";
import createInpuFolder from "./create-example/create-input-folder";
import createOutputFolder from "./create-example/create-output-folder";
import createConfig from "./create-example/create-config";
import createMail from "./create-example/create-mail";
import createLayoutAndPartial from "./create-example/create-layout-and-partials";
import createCommonEn from "./create-example/create-common-en";
import createStyles from "./create-example/create-style";
import logger from "node-color-log";

const rootFolder = process.cwd();
const folderName = "example";
const fromPath = path.join(rootFolder, folderName);

// remove all if exist
try {
  fs.rmSync(fromPath, {
    recursive: true,
  });
} catch {}

// 1 create example folder
fs.mkdirSync(fromPath, {
  recursive: true,
});

// 2 create marilena.config.mjs
createConfig(fromPath);

// 3 create example/input example/ouuput
createInpuFolder(fromPath);
createOutputFolder(fromPath);

// 4 create example/input/welcome (en, index.html)
createMail(fromPath);

// 5 create layout and partials
createLayoutAndPartial(fromPath);

// 6 create example/input/common-en.yml
createCommonEn(fromPath);

// 7 create example/input/styles.css
createStyles(fromPath);

logger.debug(
  'I created a basic working example for you :). Check folder "example"',
);
