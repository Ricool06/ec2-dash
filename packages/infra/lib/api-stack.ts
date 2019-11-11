import {
  AuthorizationType, CfnAuthorizer, Cors, LambdaIntegration, MethodResponse, RestApi } from '@aws-cdk/aws-apigateway';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Code, Function as LambdaFunction, Runtime } from '@aws-cdk/aws-lambda';
import { CfnOutput, Construct, Fn, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, deploymentStage: string) {
    super(scope, id, props);

    const cognitoUserPoolArn = Fn.importValue(`${deploymentStage}CognitoUserPoolArn`);

    const getInstancesLambda = new LambdaFunction(this, 'get-instances', {
      code: Code.fromAsset(path.join(__dirname, '../../ec2-fetcher/.serverless/ec2-fetcher.zip')),
      handler: 'src/handler.handler',
      runtime: Runtime.NODEJS_10_X,
    });

    getInstancesLambda.addToRolePolicy(new PolicyStatement({
      actions: ['ec2:DescribeInstances'],
      resources: ['*'],
    }));

    const restApi = new RestApi(this, 'ec2-dash-api');

    const apiAuthorizer = new CfnAuthorizer(this, 'ec2-dash-cognito-authorizer', {
      identitySource: 'method.request.header.Authorization',
      name: 'ec2-dash-cognito-authorizer',
      providerArns: [cognitoUserPoolArn],
      restApiId:  restApi.restApiId,
      type: AuthorizationType.COGNITO,
    });

    const lambdaIntegration = new LambdaIntegration(getInstancesLambda, {
      integrationResponses: [{
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': '\'*\'',
        },
        statusCode: '200',
      }],
    });

    const methodResponses: MethodResponse[] = [{
      responseParameters: {
        'method.response.header.Access-Control-Allow-Origin': true,
      },
      statusCode: '200',
    }];

    const instancesResource = restApi.root.addResource('instances');
    instancesResource.addMethod('GET', lambdaIntegration, {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: { authorizerId: apiAuthorizer.ref },
      methodResponses,
    });

    instancesResource.addCorsPreflight({
      allowMethods: Cors.ALL_METHODS,
      allowOrigins: Cors.ALL_ORIGINS,
    });

    new CfnOutput(this, 'apiBaseUrl', {
      description: 'Base url for the ec2-dash api',
      exportName: `${deploymentStage}apiBaseUrl`,
      value: restApi.url,
    });
  }
}
