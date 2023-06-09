# Intro

Emails are hard to develop. there is some awesome libs that makes the development more easy. But each library allow us to do a single thing without focus on a full development flow. This project wants to mix up MJML, a template enigne for variables/logic and a web server.

## 🚀 Usage

### Install (require node >=18)

```sh
npm i marilena
```

### How to use it

0 - setup your `package.json`:

```json
"scripts": {
  "start": "marilena --server",
  "build": "marilena --build",
  ...other
},
```

1 - create a `marilena.config.js` file under root of your project:

```js
// this is an example of config structure
module.exports = {
  inputFolder: "input",
  outputFolder: "output",
  locales: ["en", "it"],
  templateOptions: {
    engine: "eta",
    variablesType: "json",
    prepareEngine: (xxx) => {
      // engine eta => xxx = eta
      // engine handlebars => xxx = handlebars
      // read below about this part
    },
  },
};
```

2 - create a file structures based on your config. PLease remember that each email template requires `index.html` as name, and variables are loaded only from `variables.json`.

```
project
| marilena.config.js
│ package.json
│ input
│ └──common-en[variablesType] // common variables for all en emails
│ └──common-xx[variablesType] // common variables for all xx emails
│ └──buy // email name
││││││└─── index.html
││││││└─── en
│││││││││││└── variables.json
││││││└─── it
│││││││││││└── variables.json
```

3 - fill your emails template with MJML syntax

```html
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <!-- read below about template engine -->
        <mj-text>hello <%= it.user %></mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

4 - run one of these 2 commands

```sh
# open a server on http://localhost:8080
npm run start
```

```sh
# build all emails based on config (template engine, output folder, and locales)
npm run build
```

---

## Configuration

Under the hood a default configuration will be loaded but a file `marilena.config.js` allow us to set:
| name | required | description | default |
|--------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| inputFolder | X | folder where email are in the project | input |
| outputFolder | X | folder used for generated email (when run build command) | output |
| locales | X | array of languages used. If you company has only spanish email use an array of single value | ["en"] |
| templateOptions | | if you chose to use one of supported engines, this part id required to setup custom partial and other settings for the template engine selected. Read below for some use cases | empty |
| mjmlParsingOptions | | options passed to mjml render. See: [mjml options](https://www.npmjs.com/package/mjml)

---

## About templateOptions

This project can producte output html from input template. But in a real word probably we store variables in some part and render some content multiple times (example a footer). In this case `templateOptions` can define:

- `engine`: `eta` or `handlebars` are supported. Apart `eta`, which is used also in the project library, all others requires dependency installed since `marilena` use lazy import for engines.
- `variablesType`: define if variables are loaded from json file or yaml file. At this moment only `json` are supported.
- `prepareEngine`: define a callback where we can setup our engine. Basically you can define all things before the render. For example:

```js
	templateOptions: {
		engine:  "eta",
		variablesType:  "json",
		prepareEngine: (eta) => {
            // we can register partial like:
            // eta is same of var eta = require("eta");
            eta.templates.define("partial_1", eta.compile("this is partial 1"));
		},
	},
```

```js
	templateOptions: {
		engine:  "handlebars",
		variablesType:  "json",
		prepareEngine: (h) => {
            // we can register partial like:
            // handlebars is same of var h = require("handlebars");
            h.registerPartial("myPartial", "partial with {{ user }}");
		},
	},
```

---

## Use css

If you want to add a css file import in `mj-include` tag. Path start from root directory of the project (like package json):

```xml
<mjml>
  <mj-body>
    <mj-include path="input/styles.css" type="css" css-inline="inline"/>
    <!-- other mjml nodes -->
  </mj-body>
</mjml>
```

## 🚀 features

- [x] MJML support
- [x] load variables with template engine
- [x] eta.js, handlebars
- [x] fast-refresh on variables changes
- [x] fast-refresh on template change
- [x] fast-refresh on css change
- [x] load varibles from yaml format
- [x] load common variables
- [x] pass option to MJML render
- [ ] config in typescript
- [ ] ejs, nunjucks, mustache, dot, liquid
- [ ] easy way to send a real email
- [ ] fast-refresh on config change
