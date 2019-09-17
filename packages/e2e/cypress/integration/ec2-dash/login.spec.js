/// <reference types="Cypress" />

context('Login', () => {
  before(() => {
    cy
      .task('generateCognitoUser', { UserPoolId: Cypress.env('CognitoUserPoolId') })
      .as('credentials');
  });

  it('should login when given valid credentials', () => {
    cy.get('@credentials')
      .then(credentials => cy
        .visit('/')
        .get('[data-test=username-input]')
        .type(credentials.username)
        .get('[data-test=sign-in-password-input]')
        .type(credentials.password)
        .get('[data-test=sign-in-sign-in-button]')
        .click()
        .get('[data-test=require-new-password-new-password-input]'));
  });

  after(() => {
    cy.get('@credentials')
      .then(credentials => cy
        .task(
          'deleteCognitoUser',
          {
            UserPoolId: Cypress.env('CognitoUserPoolId'),
            Username: credentials.username
          }));
  });
});
