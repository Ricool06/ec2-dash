import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CfnOutput, Construct, Fn, Stack, StackProps } from '@aws-cdk/core';
import { AwsCustomResource } from '@aws-cdk/custom-resources';
import { createHash } from 'crypto';
import * as path from 'path';

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps, deploymentStage: string) {
    super(scope, id, props);

    const frontendBucket = new Bucket(this, 'static-site-bucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
    });

    const deployment = new BucketDeployment(this, 'static-site-bucket-deployment', {
      destinationBucket: frontendBucket,
      source: Source.asset(path.join(__dirname, '../../dashboard/build')),
    });

    const cognitoUserPoolId = Fn.importValue(`${deploymentStage}CognitoUserPoolId`);
    const cognitoUserPoolClientId = Fn.importValue(`${deploymentStage}CognitoUserPoolClientId`);
    const cognitoRegion = Fn.importValue(`${deploymentStage}CognitoRegion`);

    new AwsCustomResource(this, 'FrontendConfig', {
      onUpdate: {
        action: 'putObject',
        parameters: {
          Body: `window._ec2DashConfig=${JSON.stringify({cognitoUserPoolClientId, cognitoUserPoolId, cognitoRegion})};`,
          Bucket: frontendBucket.bucketName,
          Key: 'config.js',
        },
        physicalResourceId: Date.now().toString(),
        service: 'S3',
      },

      policyStatements: [
        new PolicyStatement({
           actions: ['s3:PutObject'],
           resources: [`${frontendBucket.bucketArn}/config.js`],
        }),
      ],
    }).node.addDependency(deployment);

    new CfnOutput(this, 'frontendBucketUrl', {
      description: 'URL of the bucket where static site will be served from',
      exportName: `${deploymentStage}FrontendBucketUrl`,
      value: frontendBucket.bucketWebsiteUrl,
    });
  }
}
