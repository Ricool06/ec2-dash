/// <reference types="Cypress" />

context('List instances', () => {
  before(() => cy.loginWithCognito());

  it('should list the names of all ec2 instances', () => cy
    .visit('/')
    .get('Card.Title')
    .should(titleElements => {
      const instanceNames = titleElements.map((_, titleElement) => titleElement.innerText);
      expect(instanceNames).to.contain('starbound-server');
    }));

  after(() => cy.deleteLoginUser());
});
