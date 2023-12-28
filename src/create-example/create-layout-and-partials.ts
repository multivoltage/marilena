import fs from "node:fs";
import path from "node:path";

const layoutMain = `
<mjml>
    <mj-head>
        <mj-preview>hi user</mj-preview>
    </mj-head>
    <mj-include path="input/styles.css" type="css" css-inline="inline" />
    <mj-body width="600px" background-color="#f4f4f4" class="gradient">

      <!-- header -->

      <%~ it.body %>

      <!-- footer-->
      <%~ include("../partials/footer.html") %>

    </mj-body>
</mjml>
`;

const footer = `
<mj-section css-class="gradient">
  <mj-column width="100%">
    <mj-text>this is partial for footer</mj-text>
  </mj-column>
</mj-section>
`;

export default function (fromPath: string) {
  const folder = path.join(fromPath, "input");

  // create layout folder
  fs.mkdirSync(path.join(folder, "layout"), { recursive: true });
  // create layout-main.html
  fs.writeFileSync(
    path.join(folder, "layout", "layout-main.html"),
    layoutMain,
    "utf-8",
  );
  // create partials folder
  fs.mkdirSync(path.join(folder, "partials"), { recursive: true });
  // create footer.html
  fs.writeFileSync(
    path.join(folder, "partials", "footer.html"),
    footer,
    "utf-8",
  );
}
