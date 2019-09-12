import * as cdkS3 from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import cdk = require('@aws-cdk/core');
import * as path from 'path';

export class FrontendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const frontendBucket = new cdkS3.Bucket(this, 'ec2-dash-frontend', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
    });

    new BucketDeployment(this, 'ec2-dash-fronted', {
      destinationBucket: frontendBucket,
      source: Source.asset(path.join(__dirname, '../../dashboard/build')),
    });

    new cdk.CfnOutput(this, 'frontendBucket', {
      description: 'Name of the bucket where static site will be served from',
      value: frontendBucket.bucketName,
    });
  }
}
