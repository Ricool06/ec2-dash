// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { CloudFormation, CognitoIdentityServiceProvider } = require('aws-sdk');
const crypto = require('crypto');

/** @type { import(".").filterExports } */
const filterExports = (exports) => ({
  by: (filters) => exports
    .filter(exprt => filters
      .some(filter => exprt.Name.includes(filter)))
});

/** @type { import(".").mapExports } */
const mapExports = (exports) => ({
  intoObject: (obj, valueToCropFromKey) => exports.reduce((map, exprt) => {
    map[exprt.Name.replace(valueToCropFromKey, '')] = exprt.Value;
    return map;
  }, obj)
});

const getCloudFormationExports = ({deploymentStage, exportFilters}) => new CloudFormation()
  .listExports()
  .promise()
  .then(response => response.Exports)
  .then(exports => exports
    .filter(e => e.Name.indexOf(deploymentStage) === 0))
  .then(stagedExports => filterExports(stagedExports).by(exportFilters))
  .then(filteredExports => mapExports(filteredExports).intoObject({}, deploymentStage));

const createCognitoUser = ({Username, TemporaryPassword, UserPoolId}) => new CognitoIdentityServiceProvider()
  .adminCreateUser({
    UserPoolId,
    MessageAction: 'SUPPRESS',
    Username,
    TemporaryPassword,
    DesiredDeliveryMediums: ['EMAIL'],
    ForceAliasCreation: true,
  })
  .promise();

const generateSecureString = ({length, suffix}) => crypto
  .randomBytes(length || 24)
  .toString('hex') + (suffix || '');

const generateCognitoUser = async ({UserPoolId}) => {
  const Username = generateSecureString({length: 24, suffix: '@nowhere.eu'});
  const TemporaryPassword = generateSecureString({length: 24});
  await createCognitoUser({Username, TemporaryPassword, UserPoolId});
  return {username: Username, password: TemporaryPassword};
};

const deleteCognitoUser = ({UserPoolId, Username}) => new CognitoIdentityServiceProvider()
  .adminDeleteUser({
    UserPoolId,
    Username,
  })
  .promise();


module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    createCognitoUser,
    generateSecureString,
    generateCognitoUser,
    deleteCognitoUser,
  });

  return getCloudFormationExports({
    deploymentStage: config.env.deploymentStage || `localdev${config.env.USER}`,
    exportFilters: [
      'FrontendBucketUrl',
      'CognitoRegion',
      'CognitoUserPoolId',
      'CognitoUserPoolClientId',
    ]
  })
    .then(exports => {
      config.baseUrl = exports.FrontendBucketUrl;
      config.env.CognitoRegion = exports.CognitoRegion;
      config.env.CognitoUserPoolId = exports.CognitoUserPoolId;
      config.env.CognitoUserPoolClientId = exports.CognitoUserPoolClientId;
      return config;
    })
    .catch(reason => console.error(reason));
};
