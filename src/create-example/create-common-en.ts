import fs from "node:fs";
import path from "node:path";

const commonEnYml = `
description: this is a description taken from common-en.yml
`;

export default function (fromPath: string) {
  const folder = path.join(fromPath, "input");

  // create common-en.yml
  fs.writeFileSync(path.join(folder, "common-en.yml"), commonEnYml, "utf-8");
}
