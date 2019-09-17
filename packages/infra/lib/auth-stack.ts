import { CfnUserPool, CfnUserPoolClient, UserPoolAttribute } from '@aws-cdk/aws-cognito';
import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';

export class AuthStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, deploymentStage: string) {
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

    new CfnOutput(this, 'cognitoUserPoolId', {
      description: 'Physical ID of the cognito user pool which will be used to store users',
      exportName: `${deploymentStage}CognitoUserPoolId`,
      value: cognitoUserPool.ref,
    });

    new CfnOutput(this, 'cognitoUserPoolClientId', {
      description: 'Physical ID of the cognito user pool client which will be used to interact with the user pool',
      exportName: `${deploymentStage}CognitoUserPoolClientId`,
      value: userPoolClient.ref,
    });

    new CfnOutput(this, 'cognitoRegion', {
      description: 'Region that the cognito resources are deployed to',
      exportName: `${deploymentStage}CognitoRegion`,
      value: this.region,
    });
  }
}
