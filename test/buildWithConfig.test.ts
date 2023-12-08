import { beforeAll, describe, expect, test } from "@jest/globals";
import { CoreConfig } from "../src/types";
import { build } from "../src/lib/buildWithConfig";
import fs from "node:fs";
import path from "node:path";
import { rimrafSync } from "rimraf";
import { Eta } from "eta";

const testEmailName = "hello"; // we have only hello.html inside inputs

describe("writer correctly email files", () => {
  beforeAll(() => {
    // delete all output test folder
    rimrafSync("test/*/output", { glob: true });
  });

  test("create email with: [engine: NO, suffix: html, locale: en]", async () => {
    const config: CoreConfig = {
      inputFolder: "test/basic_1/input",
      outputFolder: "test/basic_1/output",
      locales: ["en"],
    };

    await build(config);

    const outpoutEn = fs.readFileSync(
      path.join(config.outputFolder, testEmailName, "en", "index.html"),
      { encoding: "utf-8" },
    );

    expect(outpoutEn).toMatchSnapshot();
  });

  test("create email with: [engine: NO, suffix: html, locale: en] - custom htmlVersion", async () => {
    const config: CoreConfig = {
      inputFolder: "test/basic_1/input",
      outputFolder: "test/basic_1/output",
      htmlVersion: (emailName, locale) => `${emailName}-${locale}.html`,
      locales: ["en"],
    };

    await build(config);

    const outpoutEn = fs.readFileSync(
      path.join(config.outputFolder, testEmailName, "en", "hello-en.html"),
      { encoding: "utf-8" },
    );

    expect(outpoutEn).toMatchSnapshot();
  });

  test("create email with: [engine: eta, suffix: html, locale: en]", async () => {
    const config: CoreConfig = {
      inputFolder: "test/eta_1/input",
      outputFolder: "test/eta_1/output",
      locales: ["en"],
      templateOptions: {
        engine: "eta",
        prepareEngine: (engine: any) => {
          const eta = engine as Eta;
          eta.configure({
            views: path.resolve(__dirname, "eta_1/input/partials"),
          });

          eta.loadTemplate("@partial_1", "this is programmatly partial");
        },
      },
    };

    await build(config);

    const outpoutEn = fs.readFileSync(
      path.join(config.outputFolder, testEmailName, "en", "index.html"),
      { encoding: "utf-8" },
    );

    fs.rmSync(config.outputFolder, { recursive: true });

    expect(outpoutEn).toMatchSnapshot();
  });

  test("create email with: [engine: handlebars, suffix: html, locale: en]", async () => {
    const config: CoreConfig = {
      inputFolder: "test/handlebars_1/input",
      outputFolder: "test/handlebars_1/output",
      locales: ["en"],
      templateOptions: {
        engine: "handlebars",
        prepareEngine: (h: any) => {
          h.registerPartial("myPartial", "partial with {{ user }}");
        },
      },
    };

    await build(config);

    const outpoutEn = fs.readFileSync(
      path.join(config.outputFolder, testEmailName, "en", "index.html"),
      { encoding: "utf-8" },
    );

    fs.rmSync(config.outputFolder, { recursive: true });

    expect(outpoutEn).toMatchSnapshot();
  });

  test("create text version email", async () => {
    const config: CoreConfig = {
      inputFolder: "test/text_version/input",
      outputFolder: "test/text_version/output",
      locales: ["en"],
      textVersion: (emailName, locale) => `${emailName}-${locale}.txt`,
    };

    await build(config);

    const outpoutTextVersion = fs.readFileSync(
      path.join(
        config.outputFolder,
        testEmailName,
        "en",
        `${testEmailName}-en.txt`,
      ),
      { encoding: "utf-8" },
    );

    fs.rmSync(config.outputFolder, { recursive: true });

    expect(outpoutTextVersion).toMatchSnapshot();
  });

  test("create email with unsupported engine should throw error", async () => {
    expect.assertions(1);

    const config: CoreConfig = {
      inputFolder: "test/handlebars_1/input",
      outputFolder: "test/handlebars_1/output",
      locales: ["en"],
      templateOptions: {
        engine: "fake-engine" as any, // we use any since thid file is in ts and a consumer can use a normal mjs file without import types
        prepareEngine: () => {},
      },
    };

    try {
      await build(config);
    } catch (e) {
      expect(e.message).toContain(
        "engine fake-engine not supported. Options available are",
      );
    }
  });
});
