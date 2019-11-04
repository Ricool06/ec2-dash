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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('loginWithCognito', () => cy
  .clearLocalStorage()
  .task('generateCognitoUser', { UserPoolId: Cypress.env('CognitoUserPoolId') })
  .as('loginCredentials')
  .get('@loginCredentials')
  .then(({ username, password }) => cy
    .task('loginCognitoUser', {
      username,
      password,
      userPoolWebClientId: Cypress.env('CognitoUserPoolClientId'),
      userPoolId: Cypress.env('CognitoUserPoolId'),
      region: Cypress.env('CognitoRegion'),
    })
    .as('cognitoResponse')
    .get('@cognitoResponse')
    .then(cognitoResponse => {
      const keyPrefixWithUsername = `${cognitoResponse.keyPrefix}.${cognitoResponse.username}`;
      window.localStorage.setItem(`${keyPrefixWithUsername}.idToken`, cognitoResponse.signInUserSession.idToken.jwtToken);
      window.localStorage.setItem(`${keyPrefixWithUsername}.accessToken`, cognitoResponse.signInUserSession.accessToken.jwtToken);
      window.localStorage.setItem(`${keyPrefixWithUsername}.refreshToken`, cognitoResponse.signInUserSession.refreshToken.token);
      window.localStorage.setItem(`${keyPrefixWithUsername}.clockDrift`, cognitoResponse.signInUserSession.clockDrift);
      window.localStorage.setItem(`${cognitoResponse.keyPrefix}.LastAuthUser`, cognitoResponse.username);
      window.localStorage.setItem('amplify-authenticator-authState', 'signedIn');
    })));

Cypress.Commands.add('deleteLoginUser', () => cy
  .get('@loginCredentials')
  .then(loginCredentials => cy
    .task(
      'deleteCognitoUser',
      {
        UserPoolId: Cypress.env('CognitoUserPoolId'),
        Username: loginCredentials.username
      })));