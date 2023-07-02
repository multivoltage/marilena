# Development

This document describes the process for running this application on your local computer.

## Getting started

It runs on macOS, and Linux environments. Windows in not supported now
You'll need Node.js >= 18.
Once you've installed Node.js (which includes the popular `npm` package manager), open Terminal and run the following:

## What we provide to consumer

1. `serve`: consumer can use [http://localhost:8080](http://localhost:8080) to navigate emails on browser.
   User can run: `node ./node_modules/.bin/marilena --server`
2. `build`: consumer can call this command when is happy with results. It generate folders based on config file provided
   User can run `node ./node_modules/.bin/marilena --build`

## Project structure

1. `bin` folder:
   mandatory for consumer project that want to call `--build` or `--server`
2. `test` folder:
   this project use jest in combination with different configuration and check snapshot.
3. `marilena.config.js`:
   this is configuration file used during ONLY on development.

## Project structure for 1 email

Based on a config like:

```
module.exports = {
	templateSuffix:  ".html",
	inputFolder:  "input",
	outputFolder:  "output",
	locales: ["en","it],
	templateOptions: {
		engine:  "eta",
		prepareEngine: (eta) => {
			eta.templates.define("mypartial", eta.compile("PARTIAL SPEAKING"));
		},
	},
};
```

during development `npm run start` and `npm run build` expects this three:

```

```

project
│ package.json
│ input
│ └─── buy // email name
││││││ └─── index.html // index[templateSuffix]
││││││ └─── en
│││││││││││ └─── variables.json
││││││└─── it
││││││││││└─── variables.json

todos:

- this module need to provide 2 command (server and build) used by a consumer project (try with npm link)
- try to load a config file in js/ts because we need to handle etc/handlebars setup methods
- remove cp and use an utility working in all OS
- load common variables
- load metadata
