import { describe, expect, test } from "@jest/globals";
import { Config } from "../src/lib/type";
import { build } from "../src/lib/buildWithConfig";
import fs from "fs";
import path from "path";

const testEmailName = "hello"; // we have only hello.html inside inputs

describe("writer correctly email files", () => {
  test("create email with: [engine: NO, suffix: html, locale: en]", () => {
    const config: Config = {
      templateSuffix: ".html",
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
      templateSuffix: ".html",
      inputFolder: "test/eta_1/input",
      outputFolder: "test/eta_1/output",
      locales: ["en"],
      templateOptions: {
        variablesType: "json",
        engine: "eta",
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
