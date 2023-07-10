#!/usr/bin/env node

"use strict";

var argv = require("minimist")(process.argv.slice(2));
var logger = require("node-color-log");

if (argv.server) {
  logger.info("run server");
  require("../dist/server.js");
} else if (argv.build) {
  logger.info("run build email");
  require("../dist/lib/buildAllEmails");
} else if (argv["create-example"]) {
  require("../dist/create-example.js");
} else {
  logger.info("please use --build or --server or --create-example commands");
}
