/// <reference types="cypress" />
import { SERVER_PORT } from "../../src/const";

const welcomeHrefUrl = "/welcome";
const welcomeHrefUrl_it = (locale) => `${welcomeHrefUrl}/${locale}`;

describe("Email Render - Playground", () => {
  it("home page show email founded list with links", () => {
    cy.visit(`http://localhost:${SERVER_PORT}/`);

    cy.contains("Email founded");
    cy.contains("welcome").should("have.attr", "href", welcomeHrefUrl);
  });

  it("welcome email should render language variants [it,en]", () => {
    cy.visit(`http://localhost:${SERVER_PORT}` + welcomeHrefUrl);

    cy.get("ul").within(() => {
      cy.contains("it").should("have.attr", "href", welcomeHrefUrl_it("it"));
      cy.contains("en").should("have.attr", "href", welcomeHrefUrl_it("en"));
    });
  });

  it("welcome it email should render correctly", () => {
    cy.visit(`http://localhost:${SERVER_PORT}${welcomeHrefUrl_it("it")}`);

    cy.wait(1000);
    cy.getEmailFrame().then(($el) => {
      // check header_title
      expect($el.text()).to.contain("Benvenuto {{ user }}");
      // check common-it
      expect($el.text()).to.contain(
        "questa è una descrizione presa da common-it.yml",
      );
      // check footer
      expect($el.text()).to.contain("this is partial for footer");
    });
  });
});

describe("Email refresh - Playground", () => {
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
    cy.visit(`http://localhost:${SERVER_PORT}${welcomeHrefUrl_it("it")}`);

    cy.contains("body", NOT_EXISTING_TEXT).should("not.exist");
    cy.readFile(filePathHtml).then((text: string) => {
      const stringToChange = "engine like handlebars";
      // checking this is important because test pass if for some reason we cal replace for a missing string
      expect(text).contains(stringToChange);
      const newText = text.replace(stringToChange, NOT_EXISTING_TEXT);
      cy.writeFile(filePathHtml, newText, "utf-8");
    });

    cy.wait(1000); // without that for some reason cypress load old body
    cy.getEmailFrame().then(($el) => {
      expect($el.text()).to.contain(NOT_EXISTING_TEXT);
    });
  });

  it("email page should refresh when common variables change", () => {
    const NOT_EXISTING_TEXT = "NOT_EXISTING-#-NOT_EXISTING" + Math.random();
    cy.visit(`http://localhost:${SERVER_PORT}${welcomeHrefUrl_it("en")}`);

    cy.contains("body", NOT_EXISTING_TEXT).should("not.exist");
    cy.readFile(filePathVariablesCommonEn).then((text: string) => {
      const stringToChange = "this is a description taken";
      // checking this is important because test pass if for some reason we cal replace for a missing string
      expect(text).contains(stringToChange);
      const newText = text.replace(stringToChange, NOT_EXISTING_TEXT);
      cy.writeFile(filePathVariablesCommonEn, newText, "utf-8");
    });

    cy.wait(1000); // without that for some reason cypress load old body
    cy.getEmailFrame().then(($el) => {
      expect($el.text()).to.contain(NOT_EXISTING_TEXT);
    });
  });

  it("email page should refresh when en dedicated variables change", () => {
    const NOT_EXISTING_TEXT = "NOT_EXISTING-#-NOT_EXISTING" + Math.random();
    cy.visit(`http://localhost:${SERVER_PORT}${welcomeHrefUrl_it("en")}`);

    cy.contains("body", NOT_EXISTING_TEXT).should("not.exist");
    cy.readFile(filePathVariablesEn).then((text: string) => {
      const stringToChange = "Welcome {{ user }}";
      // checking this is important because test pass if for some reason we cal replace for a missing string
      expect(text).contains(stringToChange);
      const newText = text.replace(stringToChange, NOT_EXISTING_TEXT);
      cy.writeFile(filePathVariablesEn, newText, "utf-8");
    });

    cy.wait(1000); // without that for some reason cypress load old body
    cy.getEmailFrame().then(($el) => {
      expect($el.text()).to.contain(NOT_EXISTING_TEXT);
    });
  });
});

describe("Email Actions - Playground", () => {
  it("email page with should sendOptions should send a test email and render result without error", () => {
    cy.visit(`http://localhost:${SERVER_PORT}${welcomeHrefUrl_it("en")}`);

    cy.intercept("POST", /api\/send/, {
      fixture: "postSendEmail_aws_ses_ok",
      statusCode: 200,
    }).as("postSendEmail");

    cy.get(".send-to input")
      .invoke("attr", "placeholder")
      .should("contain", Cypress.env("SEND_TEST_OPTION_TO"));
    cy.contains("send email").click();
    cy.wait("@postSendEmail");
    cy.get(".send-to__modal").should("be.visible");
  });

  it("email page with should sendOptions should send a test email and render result with error", () => {
    cy.visit(`http://localhost:${SERVER_PORT}${welcomeHrefUrl_it("en")}`);

    cy.intercept("POST", /api\/send/, {
      fixture: "postSendEmail_aws_ses_ko",
      statusCode: 400,
    }).as("postSendEmail");

    cy.get(".send-to input")
      .invoke("attr", "placeholder")
      .should("contain", Cypress.env("SEND_TEST_OPTION_TO"));
    cy.contains("send email").click();
    cy.wait("@postSendEmail");
    cy.get(".send-to__modal").should("be.visible");
  });
});

// describe.only("delete", () => {
//   before(() => {
//     cy.wrap("asmdsdj").as("todo");
//   });

//   it("test 1", function () {
//     cy.visit(`http://localhost:8080/${welcomeHrefUrl_it("en")}`);

//     // cy.wrap("asmdsdj").as("todo");

//     cy.on("fail", () => {
//       console.log("saved todo is", this.todo);
//       // cy.get("@todo").then((c) => console.log(c));
//       // cy.get("@todo").then((c) => console.log(c));
//       // cy.get("@todo").then((c) => console.log(c));
//       console.log("fail");
//     });

//     // throw new Error("ciccio");
//   });
// });
