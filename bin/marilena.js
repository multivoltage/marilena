#!/usr/bin/env node

"use strict";

var argv = require("minimist")(process.argv.slice(2));

if (argv.server) {
  console.log("run server");
  require("../dist/server.js");
} else if (argv.build) {
  console.log("run build email");
  require("../dist/lib/buildAllEmails");
} else {
  console.log("please use --build or --server commands");
}
