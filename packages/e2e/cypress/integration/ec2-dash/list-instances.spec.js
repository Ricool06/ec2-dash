/// <reference types="Cypress" />

context('List instances', () => {
  before(() => cy.loginWithCognito());

  it('should list the names of all ec2 instances', () => cy
    .visit('/')
    .get('.card-title')
    .first()
    .contains('starbound-server'));

  after(() => cy.deleteLoginUser());
});
