import fs from "node:fs";
import path from "node:path";

const mail = `
<% layout("./layout/layout-main.html") %>

<!-- HEADER -->
<mj-section css-class="gradient">
  <mj-column width="100%">
    <mj-image
      src="https://picsum.photos/200"
      alt=""
      align="center"
      width="150px"
    />
  </mj-column>
</mj-section>

<!-- CONTENT -->
<mj-section background-color="white">
  <mj-column width="100%">
    <mj-text font-family="Helvetica" mj-class="mjclass">
      <h1>This is a working example with:</h1>
      <ul>
        <li>eta js</li>
        <li>partials</li>
        <li>layout</li>
        <li>styles css</li>
        <li>variables in yml file</li>
      </ul>
      <p><%~ it.header_title %></p>
      <p><%~ it.description %></p>
      <b><pre>{{ user }}</pre></b> come from variables, in case you have to
      build and upload emails where there is a backend which parse and compile
      with other engine like handlebars
    </mj-text>
  </mj-column>
</mj-section>
`;

const variablesEnYml = `
header_title: "Welcome {{ user }}"
`;

export default function (fromPath: string) {
  const emailName = "example-one";
  const folder = path.join(fromPath, "input", emailName);

  // create example-one
  fs.mkdirSync(folder, { recursive: true });
  // create en folder
  fs.mkdirSync(path.join(folder, "en"), { recursive: true });
  // create variables.yml
  fs.writeFileSync(
    path.join(folder, "en", "variables.yml"),
    variablesEnYml,
    "utf-8",
  );
  // create index.html
  fs.writeFileSync(path.join(folder, "index.html"), mail, "utf-8");
}
