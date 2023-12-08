import fs from "node:fs";
import path from "node:path";

export default function (fromPath: string) {
  fs.mkdirSync(path.join(fromPath, "output"));
}
