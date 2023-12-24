import fs from "node:fs";
import path from "node:path";

const env = `
# used by marilena
AWS_ACCESS_KEY="xxx"
AWS_SECRET="yyy"
SEND_TEST_OPTION_TO="example-to@gmail.com"
SEND_TEST_OPTION_FROM="noreply@todo.com"
`;

export default function (fromPath: string) {
  // create styles.css
  fs.writeFileSync(path.join(fromPath, ".env"), env, "utf-8");
}
