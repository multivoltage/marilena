## The problem

We know emails are `VERY HARD` to develop from scratch. Even if there are tools like Maiject, SendPulse, MailerSend, Stripo.email etc (maybe with a good drag-n-drop UI) sometimes you find yourself in one of the following cases:

- you need to produce some html files using layouts and partials for different languages, passing them to a backend witch add maybe some data coming from itself (or another service) and fills your html files with its template engine.
- backend of your company deploy email using with a custom service that use Amazon SES.
- previous providers are not able to customize some parts. For example css rule. Or to do this is very complicated.
- coming from [email-foundation-template](https://github.com/foundation/foundation-emails) and you want to try a different tool with advantages (please read below about features), or you need to use different template engine with more power (see Eta.js).
- having complete control of development without use any Saas is mandatory.

## This solution

`marilena` wants to mix up MJML, an optional template engine for variables and a web server, to create a tool able to generate emails with a simple flow and one command. Please keep in mind that Maiject, SendPulse, MailerSend, Stripo.email etc maybe can be already perfect for your purpose.

## 🚀 Usage

### Install (require node >=18)

```sh
npm i marilena
```

### Setup

`marilena` provides a command witch generate a small but working example with eta.js, variables, layout and partials. You can generate an example with:

```
npx marilena --create-example
```

and change `package.json` like:

```json
"type": "module",
"scripts": {
  "start": "marilena --server --project example/marilena.config.mjs",
  "build": "marilena --build --project example/marilena.config.mjs",
},
```

### Setup (manual)

If you fails to generate the example or you want to build a project from 0 you need to crete `marilena.config.mjs` file in the root of your project. Please check below the fields since any of these are required.

```js
import path from "node:path";
// you can leverage your IDE's intellisense with jsdoc type hints
/** @type {import('marilena/dist/src/types').UserConfig} */
export default {
  inputFolder: "./input",
  outputFolder: "./output",
  textVersion: (emailName, locale) => `${emailName}_text_version-${locale}.txt`,
  htmlVersion: (emailName, locale) => `${emailName}-custom.html`,
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

Edit you `package.json`. By default `marilena` try to find config in the root of your project. If you put the config in a different path, you need to pass `--project` argument in the scripts

```json
"scripts": {
  "start": "marilena --server",
  "build": "marilena --build",
},
```

create a file structures based on your config. Please remember that each email template requires `index.html` as name, and variables are loaded only from `variables.json` or `variables.yml`. Yes you can use both (result will be an union of two).

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
# build all emails based on config
npm run build
```

## Configuration

Under the hood a default configuration will be loaded but a file `marilena.config.mjs` allow us to set:
| name | required | description | default |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| inputFolder | | folder where email are in the project. Path is relative to `marilena.config.mjs` | ./input |
| outputFolder | | folder used for generated email (when run build command). Path is relative to `marilena.config.mjs` | ./output |
| locales | | array of languages used. If you need only spanish email use an array of single value | ["en"] |
| templateOptions | | if you chose to use one of supported engines, this part is mandatory to setup custom partial and other settings for the template engine selected. Read below for some use cases | empty |
| mjmlParsingOptions | | options passed to mjml render. See: [mjml options](https://www.npmjs.com/package/mjml) |
| htmlVersion | | function of type `(emailName: string, locale: string) => string`. If set, this function allow to customize the output html filename. The function must return file name `es: ${emailName}-${locale}.html` | index.html |
| textVersion | | function of type `(emailName: string, locale: string) => string`. If set, this function allow to generate text version of email stripping all html. The function must return file name `es: ${emailName}-${locale}-text-version.txt` |
| sendTestOptions | | option in case you want to send the email to some account for testing. Setting this should add `send-email` button during development: Read below for some use cases |
| fillFakeMetaData | | function of type `(outputHtml: string, fakeData: object) => string`. If set, this function allow to "simulate" a backend, parsing final output and replace with fake data. See dedicate section for details. |

---

## Load env variables

Marilena uses `dotenv` out of the box. So if you create `.env` file (or it is created by runnning `create-example`) marilena will load variables from there.

## About templateOptions

This project can producte output html from input template. But in a real word probably we store variables in some part and render some content multiple times (example a footer). In this case `templateOptions` can define:

- `engine`: `eta` or `handlebars` are supported. These deps are peer-dependency so if you want to use ones please install that as dependency.
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

## About sendTestOptions

This option provides a fast way to test email sending an email to real account. You shoud pass also `createTransport` function that return a `Transporter`.
See [nodemailer tutorial](https://nodemailer.com/smtp/)

Example `marilena.config.mjs` to work with Aws SES:

```js
import * as aws from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";

export default {
  ...config,
  sendTestOptions: {
    to: "diego.tonini93@gmail.com",
    from: "noreply@custom-domain.com", // this is not random email, but should be registered in you provider
    createTransport: () =>
      nodemailer.createTransport({
        SES: {
          ses: new aws.SES({
            apiVersion: "2010-12-01",
            region: "us-east-1",
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY || "secret",
              secretAccessKey: process.env.AWS_SECRET || "secret",
            },
          }),
          aws,
        },
      }),
  },
};
```

Example `marilena.config.mjs` to work with forwardemail or other custom setting;

```js
import nodemailer from "nodemailer";

export default {
  ...config,
  sendTestOptions: {
    to: "diego.tonini93@gmail.com",
    from: "noreply@custom-domain.com", // this is not random email, but should be registered in you provider
    createTransport: () =>
      nodemailer.createTransport({
        host: "smtp.forwardemail.net",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
          pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
        },
      }),
  },
};
```

## About fillFakeMetaData

In the real world the html produced by `marilena` is consumed by a backend. Probably this backend will fill email with real data using some template engine like jinja (php) or handlebars (php js) or blocks (go) etc. In some case we can mock a minimal behavior. This is useful for:

- render email with custm data
- test a send with some data

Follow these step:

- add `fillFakeMetaData` in `marilena.config.mjs`

```js
import Handlebars from "handlebars";

export default {
  /* this example is made with Handlebars but you can use any js template engine */
  fillFakeMetaData: (outputHtml, fakeData) => {
    const template = Handlebars.compile(outputHtml);
    return template(fakeData);
  },
};
```

- create `metadata.json` or `metadata.yml` under `[inputFolder]/[emailName]/[locale]` path (same path of variables).

```json
{
  "user": "Diego Tonini",
  "people": [
    {
      "name": "Luca Pavesi",
      "age": 23
    }
  ]
}
```

## Add css/scss style

You have some options to apply styles on your email:

- Use `<mj-style>` tag (read MJML documentatation)

```
<mj-style inline="inline">
  .blue-text div {
    color: blue !important;
  }
</mj-style>
```

- create a `style.css` inside `inputFolder` and import in `mj-include` tag. Path start from root directory of the project (like `package.json`):

```xml
<mjml>
  <mj-include path="input/styles.css" type="css" css-inline="inline"/>
  <mj-body>
    <!-- other mjml nodes -->
  </mj-body>
</mjml>
```

- create a `style.scss` inside `inputFolder`. A compiled css will be added to the `<head>` of document.

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
- [x] send test email (nodemailer, aws ses)

## 🏗️ Roadmap (PRs are welcome 😀)

- [ ] liquid, ejs, nunjucks, mustache, dot
- [ ] config in typescript
- [ ] fast-refresh on config change
- [ ] snaphost test for each email out of the box
