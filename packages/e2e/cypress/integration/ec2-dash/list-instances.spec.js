/// <reference types="Cypress" />

context('List instances', () => {
  before(() => {
    cy
      .task('generateCognitoUser', { UserPoolId: Cypress.env('CognitoUserPoolId') })
      .as('listInstancesCredentials')
      .get('@listInstancesCredentials')
      .then(listInstancesCredentials => cy
        .task('loginCognitoUser', {
          username: listInstancesCredentials.username,
          password: listInstancesCredentials.password,
          userPoolWebClientId: Cypress.env('CognitoUserPoolClientId'),
          userPoolId: Cypress.env('CognitoUserPoolId'),
          region: Cypress.env('CognitoRegion'),
        })
        .as('cognitoResponse')
        .get('@cognitoResponse')
        .then(x => {
          console.log(x);
          return x;
        })
        .then(cognitoResponse => {
          const keyPrefixWithUsername = `${cognitoResponse.keyPrefix}.${cognitoResponse.username}`;
          window.localStorage.setItem(`${keyPrefixWithUsername}.idToken`, cognitoResponse.signInUserSession.idToken.jwtToken);
          window.localStorage.setItem(`${keyPrefixWithUsername}.accessToken`, cognitoResponse.signInUserSession.accessToken.jwtToken);
          window.localStorage.setItem(`${keyPrefixWithUsername}.refreshToken`, cognitoResponse.signInUserSession.refreshToken.token);
          window.localStorage.setItem(`${keyPrefixWithUsername}.clockDrift`, cognitoResponse.signInUserSession.clockDrift);
          window.localStorage.setItem(`${cognitoResponse.keyPrefix}.LastAuthUser`, cognitoResponse.username);
          window.localStorage.setItem('amplify-authenticator-authState', 'signedIn');
        }));
  });

  it('should login when given valid credentials', () => {
    cy.visit('/');
  });

  after(() => {
    cy.get('@listInstancesCredentials')
      .then(listInstancesCredentials => cy
        .task(
          'deleteCognitoUser',
          {
            UserPoolId: Cypress.env('CognitoUserPoolId'),
            Username: listInstancesCredentials.username
          }));
  });
});
