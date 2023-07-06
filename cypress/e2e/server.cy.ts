/// <reference types="cypress" />

const welcomeHrefUrl = "playground/input/welcome";
const welcomeHrefUrl_it = (locale) => `welcome/${locale}/index.html`;

describe("Server", () => {
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
    cy.visit("http://localhost:8080/playground/input/welcome/it/index.html");

    // check header_title
    cy.contains("Benvenuto {{ user }}");
    // check common-it
    cy.contains("questa è una descrizione presa da common-it.yml");
    // check footer
    cy.contains("this is partial for footer");
  });
});
