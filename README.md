# Intro

We know emails are `VERY HARD` to develop.
Sometimes you can use tool like Maiject, SendPulse, MailerSend, Stripo.email etc. Some if this have cool interface with drag and drop and different actions to do.

So why you/your company should use this library?

- previous providers are not able to customize some parts. For example css rule. Or to do this is very complicated.
- coming from [email-foundation-template](https://github.com/foundation/foundation-emails) and you want to try a different tool with advantages (please read below about features).
- having complete control of development without use any Saas is mandatory.
- the builded emails should be consumed by a backend service which use the emails again adding metadata coming from itself, or another api service for example. This scenario is the motivation which produced this library.

Today market and opensource offers library that makes the development more easy. But each library/tools allow us to do a single thing without focus on a full development flow. This project wants to mix up MJML, a template engine for variables/logic and a web server, to create a tool able to generate emails with a simple flow and command. Please keep in mind that market offers some cool services like Maiject, SendPulse, MailerSend, Stripo.email etc so maybe you can find a fit with one of these solutions.

## 🚀 Usage

### Install (require node >=16)

```sh
npm i marilena
```

### How to use it

0 - setup your `package.json`:

```json
"scripts": {
  "start": "marilena --server",
  "build": "marilena --build",
  "example": "marilena --create-example", // if you run this script, it generates a working example, and then you can run start
},
```

1 - create a `marilena.config.mjs` file. Preferably under the root project:

```js
import path from "path";
// you can leverage your IDE's intellisense with jsdoc type hints
/** @type {import('marilena').Config} */
export default {
  inputFolder: "./input",
  outputFolder: "./output",
  textVersion: (emailName, locale) => `${emailName}_text_version-${locale}.txt`,
  locales: ["it", "en"],
  templateOptions: {
    engine: "eta",
    prepareEngine: (eta) => {
      eta.configure({
        views: path.join(process.cwd(), "playground/input"),
      });
    },
  },
  mjmlParsingOptions: {
    keepComments: false,
  },
};
```

1A - if you put `marilena.config.mjs` in a different path folder, or you did not generated a demo with `marilena --create-example` you have to update scripts:

```json
"scripts": {
  "start": "marilena --server --project myFolder/marilena.config.mjs",
  "build": "marilena --build --project myFolder/marilena.config.mjs",
},
```

2 - create a file structures based on your config. Please remember that each email template requires `index.html` as name, and variables are loaded only from `variables.json` or `variables.yml`.

```
project
| marilena.config.mjs
│ package.json
│ input
│ └──common-en.json // common json variables for all en emails
│ └──common-it.yaml // common yaml variables for all it emails
│ └──buy // email name
││││││└─── index.html
││││││└─── en
│││││││││││└── variables.json // json variables for en buy email
││││││└─── it
│││││││││││└── variables.yaml // yaml variables for it buy email
```

3 - fill your emails template with MJML syntax

```html
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <!-- eta js example, read below about template engine -->
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

## Configuration

Under the hood a default configuration will be loaded but a file `marilena.config.mjs` allow us to set:
| name | required | description | default |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| inputFolder | X | folder where email are in the project. Path is relative to `marilena.config.mjs` | input |
| outputFolder | X | folder used for generated email (when run build command). Path is relative to `marilena.config.mjs` | output |
| locales | X | array of languages used. If you company has only spanish email use an array of single value | ["en"] |
| templateOptions | | if you chose to use one of supported engines, this part is mandatory to setup custom partial and other settings for the template engine selected. Read below for some use cases | empty |
| mjmlParsingOptions | | options passed to mjml render. See: [mjml options](https://www.npmjs.com/package/mjml) |
| textVersion | | function of type `(emailName: string, locale: string) => string`. If set, this function allow to generate text version of email stripping all html. The function must return file name `es: ${emailName}-${locale}-text-version.txt` |

## About templateOptions

This project can producte output html from input template. But in a real word probably we store variables in some part and render some content multiple times (example a footer). In this case `templateOptions` can define:

- `engine`: `eta` or `handlebars` are supported. Apart `eta`, which is used also in the project library, all others requires dependency installed since `marilena` use lazy import for engines.
- `prepareEngine`: define a callback where we can setup our engine. Basically you can define all things before the render. For example:

```js
templateOptions: {
  engine:  "eta",
  prepareEngine: (eta) => {
    // eta is an istance of new Eta() so you need to set at least views options for templates/layout/partials
    eta.configure({
      views: path.join(process.cwd(), "input"),
    });
    // we can call all eta-js api like:
    eta.loadTemplate(...);
  },
},
```

```js
templateOptions: {
  engine:  "handlebars",
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

## 🚀 Features

- [x] MJML support
- [x] load variables with template engine
- [x] multi language out of the box
- [x] eta.js, handlebars (need to install if you use one of these engines)
- [x] fast-refresh on variables changes
- [x] fast-refresh on template change
- [x] fast-refresh on css change
- [x] load varibles from yaml/json format
- [x] load common variables
- [x] pass option to MJML render

## 🏗️ Roadmap (PRs are welcome 😀)

- [ ] ejs, nunjucks, mustache, dot, liquid
- [ ] config in typescript
- [ ] easy way to send a real email (AWS SES)
- [ ] fast-refresh on config change
