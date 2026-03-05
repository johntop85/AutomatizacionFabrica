// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Glabal para Login

Cypress.Commands.add('login', (usuario, clave) => {
  // 1. Visitar la página de login
  cy.visit('https://fabrica2023.estrategiasegura.biz/');
  
  // 2. Ingresar credenciales
  cy.get('#Email').type(usuario);
  cy.get('#Password').type(clave);
  
  // 3. Hacer clic en Entrar
  cy.get('#Inicio').click();

  // 4. (Opcional pero recomendado) Validar que el login fue exitoso 
  // antes de continuar con la prueba. Por ejemplo, validar que aparece el menú.
  cy.get('.navbar-brand').should('contain.text', 'FABRICA DE CRÉDITOS'); 
});