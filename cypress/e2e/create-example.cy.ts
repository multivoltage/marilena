/// <reference types="cypress" />

const welcomeHrefUrl = "example-one";
const welcomeHrefUrl_it = (locale) => `example-one/${locale}/index.html`;

describe("create-example", () => {
  it("home page show email founded list with links", () => {
    cy.visit("http://localhost:8080/");

    cy.contains("Email founded");
    cy.contains("example-one").should("have.attr", "href", welcomeHrefUrl);
  });

  it("welcome email should render language variants [it,en]", () => {
    cy.visit("http://localhost:8080/" + welcomeHrefUrl);

    cy.get("ul").within(() => {
      cy.contains("en").should("have.attr", "href", welcomeHrefUrl_it("en"));
    });
  });

  it("welcome it email should render correctly", () => {
    cy.visit(`http://localhost:8080/${welcomeHrefUrl_it("en")}`);

    cy.contains("This is a working example with:");
    // check header_title
    cy.contains("Welcome {{ user }}");
    // check common-it
    cy.contains("this is a description taken from common-en.yml");
    // check footer
    cy.contains("this is partial for footer");
  });
});
