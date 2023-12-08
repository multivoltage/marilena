import fs from "node:fs";
import path from "node:path";

const css = `
/* example css used in input/buy email */
.gradient {
  background: linear-gradient(
    90deg,
    rgb(62, 224, 216) 0%,
    rgb(26, 19, 96) 70%,
    rgb(26, 19, 28) 100%
  );
}
`;

export default function (fromPath: string) {
  const folder = path.join(fromPath, "input");

  // create styles.css
  fs.writeFileSync(path.join(folder, "styles.css"), css, "utf-8");
}
