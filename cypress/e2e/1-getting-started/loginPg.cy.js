/// <reference types="cypress" />

describe('Ingreso Login', () => {
  beforeEach(() => {
    cy.visit('https://fabrica2023.estrategiasegura.biz/')
  });

  it('CP01 - Buscar texto Inicio de sesión', () => {
    cy.get('h5').should('have.text', ' Inicio de Sesión')
    cy.contains('Inicio').should('have.text', ' Inicio de Sesión')
  });

  it('CP02 - Debería iniciar sesión correctamente con credenciales válidas', () => {
    // Usamos los selectores ID del HTML
    cy.get('#Email').type('yrios');
    cy.get('#Password').type('yazmin1997');
    cy.get('#Inicio').click();

    // Aquí validamos qué pasa después de un login exitoso. 
    // Por ejemplo, que la URL cambie al dashboard:
    // cy.url().should('include', '/dashboard');
  });

  it('CP03 - No debería permitir enviar el formulario con campos vacíos', () => {
    cy.get('#Inicio').click();

    // Validamos que el campo Email tenga la validación HTML5 de requerido
    cy.get('#Email').invoke('prop', 'validationMessage')
      .should('not.be.empty');
  });

  it('CP04 - Debería mostrar error con credenciales incorrectas', () => {
    cy.get('#Email').type('correo@falso.com');
    cy.get('#Password').type('ClaveEquivocada');
    cy.get('#Inicio').click();

    // Aquí asumimos que tu sistema muestra un mensaje de error en la pantalla.
    // Buscamos un texto de error visible, ajusta el texto según tu aplicación.
    cy.get('.text-danger').should('be.visible');
  });

  it('CP05 - No debería permitir enviar si falta la contraseña', () => {
    cy.get('#Email').type('yrios');
    // Dejamos el password vacío
    cy.get('#Inicio').click();

    // Validamos que el campo Password pida información
    cy.get('#Password').invoke('prop', 'validationMessage')
      .should('not.be.empty');
  });
})
