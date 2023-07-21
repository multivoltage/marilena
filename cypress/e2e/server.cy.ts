/// <reference types="cypress" />

const welcomeHrefUrl = "welcome";
const welcomeHrefUrl_it = (locale) => `welcome/${locale}/index.html`;

describe("Email Render", () => {
  it("home page show email founded list with links", () => {
    cy.visit("http://localhost:8080/");

    cy.contains("Email founded");
    cy.contains("welcome").should("have.attr", "href", welcomeHrefUrl);
  });

  it("welcome email should render language variants [it,en]", () => {
    cy.visit("http://localhost:8080/" + welcomeHrefUrl);

    cy.get("ul").within(() => {
      cy.contains("it").should("have.attr", "href", welcomeHrefUrl_it("it"));
      cy.contains("en").should("have.attr", "href", welcomeHrefUrl_it("en"));
    });
  });

  it("welcome it email should render correctly", () => {
    cy.visit(`http://localhost:8080/${welcomeHrefUrl_it("it")}`);

    // check header_title
    cy.contains("Benvenuto {{ user }}");
    // check common-it
    cy.contains("questa è una descrizione presa da common-it.yml");
    // check footer
    cy.contains("this is partial for footer");
  });
});

describe("Email refresh", () => {
  const filePathHtml = "playground/input/welcome/index.html";
  const filePathVariablesCommonEn = "playground/input/common-en.yml";
  const filePathVariablesEn = "playground/input/welcome/en/variables.yml";

  // since we edit file during test we need to restore correctly
  beforeEach(() => {
    cy.readFile(filePathHtml, "utf-8").then((text: string) => {
      cy.wrap(text).as("originalHtml");
    });
    cy.readFile(filePathVariablesCommonEn, "utf-8").then((text: string) => {
      cy.wrap(text).as("originaYmlCommonEn");
    });
    cy.readFile(filePathVariablesEn, "utf-8").then((text: string) => {
      cy.wrap(text).as("originaYmlEn");
    });
  });

  afterEach(() => {
    cy.get("@originalHtml").then((text) => {
      cy.writeFile(filePathHtml, text);
    });
    cy.get("@originaYmlCommonEn").then((text) => {
      cy.writeFile(filePathVariablesCommonEn, text);
    });
    cy.get("@originaYmlEn").then((text) => {
      cy.writeFile(filePathVariablesEn, text);
    });
  });

  it("email page should refresh when html file change", () => {
    const NOT_EXISTING_TEXT = "NOT_EXISTING-#-NOT_EXISTING" + Math.random();
    cy.visit(`http://localhost:8080/${welcomeHrefUrl_it("it")}`);

    cy.contains("body", NOT_EXISTING_TEXT).should("not.exist");
    cy.readFile(filePathHtml).then((text: string) => {
      const stringToChange = "engine like handlebars";
      // checking this is important because test pass if for some reason we cal replace for a missing string
      expect(text).contains(stringToChange);
      const newText = text.replace(stringToChange, NOT_EXISTING_TEXT);
      cy.writeFile(filePathHtml, newText, "utf-8");
    });
    cy.contains("body", NOT_EXISTING_TEXT).should("exist");
  });

  it("email page should refresh when common variables change", () => {
    const NOT_EXISTING_TEXT = "NOT_EXISTING-#-NOT_EXISTING" + Math.random();
    cy.visit(`http://localhost:8080/${welcomeHrefUrl_it("en")}`);

    cy.contains("body", NOT_EXISTING_TEXT).should("not.exist");
    cy.readFile(filePathVariablesCommonEn).then((text: string) => {
      const stringToChange = "this is a description taken";
      // checking this is important because test pass if for some reason we cal replace for a missing string
      expect(text).contains(stringToChange);
      const newText = text.replace(stringToChange, NOT_EXISTING_TEXT);
      cy.writeFile(filePathVariablesCommonEn, newText, "utf-8");
    });
    cy.contains("body", NOT_EXISTING_TEXT).should("exist");
  });

  it("email page should refresh when en dedicated variables change", () => {
    const NOT_EXISTING_TEXT = "NOT_EXISTING-#-NOT_EXISTING" + Math.random();
    cy.visit(`http://localhost:8080/${welcomeHrefUrl_it("en")}`);

    cy.contains("body", NOT_EXISTING_TEXT).should("not.exist");
    cy.readFile(filePathVariablesEn).then((text: string) => {
      const stringToChange = "Welcome {{ user }}";
      // checking this is important because test pass if for some reason we cal replace for a missing string
      expect(text).contains(stringToChange);
      const newText = text.replace(stringToChange, NOT_EXISTING_TEXT);
      cy.writeFile(filePathVariablesEn, newText, "utf-8");
    });
    cy.contains("body", NOT_EXISTING_TEXT).should("exist");
  });
});
