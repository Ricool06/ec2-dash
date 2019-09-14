import { CfnUserPool, CfnUserPoolClient, UserPoolAttribute } from '@aws-cdk/aws-cognito';
import cdk = require('@aws-cdk/core');

export class AuthStack extends cdk.Stack {

  public readonly cognitoUserPoolId: string;
  public readonly cognitoUserPoolClientId: string;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const cognitoUserPool = new CfnUserPool(this, 'ec2-dash-user-pool', {
      adminCreateUserConfig: {
        allowAdminCreateUserOnly: true,
        inviteMessageTemplate: {
          emailSubject: 'Welcome to ec2-dash!',
        },
      },
      autoVerifiedAttributes: [UserPoolAttribute.EMAIL],
      policies: {
        passwordPolicy: {
          minimumLength: 8,
          requireSymbols: false,
          temporaryPasswordValidityDays: 7,
        },
      },
      userPoolName: 'ec2-dash-user-pool',
      usernameAttributes: [UserPoolAttribute.EMAIL],
    });

    const userPoolClient = new CfnUserPoolClient(this, 'ec2-dash-user-pool-client', {
      clientName: 'ec2-dash-user-pool-client',
      userPoolId: cognitoUserPool.ref,
    });

    new cdk.CfnOutput(this, 'cognitoUserPoolId', {
      description: 'Physical ID of the cognito user pool which will be used to store users',
      exportName: 'cognitoUserPoolId',
      value: cognitoUserPool.ref,
    });

    new cdk.CfnOutput(this, 'cognitoUserPoolClientId', {
      description: 'Physical ID of the cognito user pool client which will be used to interact with the user pool',
      exportName: 'cognitoUserPoolClientId',
      value: userPoolClient.ref,
    });

    new cdk.CfnOutput(this, 'cognitoRegion', {
      description: 'Region that the cognito resources are deployed to',
      exportName: 'cognitoRegion',
      value: this.region,
    });

    this.cognitoUserPoolId = cognitoUserPool.ref;
    this.cognitoUserPoolClientId = userPoolClient.ref;
  }
}
