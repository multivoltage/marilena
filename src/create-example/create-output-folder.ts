import fs from "fs";
import path from "path";

export default function (fromPath: string) {
  fs.mkdirSync(path.join(fromPath, "output"));
}
