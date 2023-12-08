/// <reference types="cypress" />
import { SERVER_PORT } from "../../src/const";

const welcomeHrefUrl = "/example-one";
const welcomeHrefUrl_it = (locale) => `${welcomeHrefUrl}/${locale}`;

describe("create-example", () => {
  it("home page show email founded list with links", () => {
    cy.visit(`http://localhost:${SERVER_PORT}`);

    cy.contains("Email founded");
    cy.contains("example-one").should("have.attr", "href", welcomeHrefUrl);
  });

  it("welcome email should render language variants [it,en]", () => {
    cy.visit(`http://localhost:${SERVER_PORT}` + welcomeHrefUrl);

    cy.get("ul").within(() => {
      cy.contains("en").should("have.attr", "href", welcomeHrefUrl_it("en"));
    });
  });

  it("welcome it email should render correctly", () => {
    cy.visit(`http://localhost:${SERVER_PORT}${welcomeHrefUrl_it("en")}`);

    cy.wait(400);
    cy.getEmailFrame().then(($el) => {
      expect($el.text()).to.contain("This is a working example with:");

      expect($el.text()).to.contain("partials");
      // check header_title
      expect($el.text()).to.contain("Welcome {{ user }}");
      // check common-it
      expect($el.text()).to.contain(
        "this is a description taken from common-en.yml",
      );
      // check footer
      expect($el.text()).to.contain("this is partial for footer");
    });
  });
});
