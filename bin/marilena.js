#!/usr/bin/env node

"use strict";

import minimist from "minimist";
import logger from "node-color-log";
var argv = minimist(process.argv.slice(2));

process.env["NODE_ENV"] = "production";

if (argv.server) {
  logger.info("run server");
  import("../dist/server.js");
} else if (argv.build) {
  logger.info("run build email");
  import("../dist/src/lib/buildAllEmails.js");
} else if (argv["create-example"]) {
  import("../dist/src/create-example.js");
} else {
  logger.info("please use --build or --server or --create-example commands");
}
