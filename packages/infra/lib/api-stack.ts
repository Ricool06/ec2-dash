import { AuthorizationType, LambdaIntegration, RestApi, CfnAuthorizer } from '@aws-cdk/aws-apigateway';
import { Code, Function as LambdaFunction, Runtime } from '@aws-cdk/aws-lambda';
import { Construct, Fn, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, deploymentStage: string) {
    super(scope, id, props);

    const cognitoUserPoolId = Fn.importValue(`${deploymentStage}CognitoUserPoolId`);
    const cognitoUserPoolArn = Fn.importValue(`${deploymentStage}CognitoUserPoolArn`);

    const getInstancesLambda = new LambdaFunction(this, 'get-instances', {
      code: Code.fromAsset(path.join(__dirname, '../../ec2-fetcher/.serverless/ec2-fetcher.zip')),
      handler: 'handler.handler',
      runtime: Runtime.NODEJS_10_X,
    });

    const restApi = new RestApi(this, 'ec2-dash-api');

    const apiAuthorizer = new CfnAuthorizer(this, 'ec2-dash-cognito-authorizer', {
      identitySource: 'method.request.header.AuthToken',
      name: 'ec2-dash-cognito-authorizer',
      providerArns: [cognitoUserPoolArn],
      restApiId:  restApi.restApiId,
      type: AuthorizationType.COGNITO,
    });

    const instancesResource = restApi.root.addResource('instances');
    instancesResource.addMethod('GET', new LambdaIntegration(getInstancesLambda), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: { authorizerId: apiAuthorizer.ref },
    });
  }
}
