import { describe, expect, test } from "@jest/globals";
import { Config } from "../src/types";
import { build } from "../src/lib/buildWithConfig";
import fs from "fs";
import path from "path";

const testEmailName = "hello"; // we have only hello.html inside inputs

describe("writer correctly email files", () => {
  test("create email with: [engine: NO, suffix: html, locale: en]", () => {
    const config: Config = {
      inputFolder: "test/basic_1/input",
      outputFolder: "test/basic_1/output",
      locales: ["en"],
    };

    build(config);

    const outpoutEn = fs.readFileSync(
      path.join(config.outputFolder, testEmailName, "en", "index.html"),
      { encoding: "utf-8" }
    );

    fs.rmSync(config.outputFolder, { recursive: true });

    expect(outpoutEn).toMatchSnapshot();
  });

  test("create email with: [engine: eta, suffix: html, locale: en]", () => {
    const config: Config = {
      inputFolder: "test/eta_1/input",
      outputFolder: "test/eta_1/output",
      locales: ["en"],
      templateOptions: {
        variablesType: "json",
        engine: "eta",
        prepareEngine: (eta: any) => {
          eta.templates.define("partial_1", eta.compile("this is partial 1"));
        },
      },
    };

    build(config);

    const outpoutEn = fs.readFileSync(
      path.join(config.outputFolder, testEmailName, "en", "index.html"),
      { encoding: "utf-8" }
    );

    fs.rmSync(config.outputFolder, { recursive: true });

    expect(outpoutEn).toMatchSnapshot();
  });

  test("create email with: [engine: handlebars, suffix: html, locale: en]", () => {
    const config: Config = {
      inputFolder: "test/handlebars_1/input",
      outputFolder: "test/handlebars_1/output",
      locales: ["en"],
      templateOptions: {
        variablesType: "yml",
        engine: "handlebars",
        prepareEngine: (h: any) => {
          h.registerPartial("myPartial", "partial with {{ user }}");
        },
      },
    };

    build(config);

    const outpoutEn = fs.readFileSync(
      path.join(config.outputFolder, testEmailName, "en", "index.html"),
      { encoding: "utf-8" }
    );

    fs.rmSync(config.outputFolder, { recursive: true });

    expect(outpoutEn).toMatchSnapshot();
  });
});
