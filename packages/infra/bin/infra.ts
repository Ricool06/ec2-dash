#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { Aws, Construct, Tag } from '@aws-cdk/core';
import 'source-map-support/register';
import { AuthStack } from '../lib/auth-stack';
import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();
const deploymentStage = app.node.tryGetContext('deploymentStage') || `localdev${process.env.USER}`;

const defaultEnv: cdk.Environment = {
  account: Aws.ACCOUNT_ID,
  region: 'eu-west-1',
};

class Ec2Dash extends Construct {
  constructor(scope: Construct, id: string, env: cdk.Environment) {
    super(scope, id);

    const authStack = new AuthStack(this, 'AuthStack', {env}, deploymentStage);
    const frontendStack = new FrontendStack(this, 'FrontendStack', {env}, deploymentStage);

    frontendStack.addDependency(authStack);
  }
}

const ec2Dash = new Ec2Dash(app, deploymentStage, defaultEnv);
Tag.add(ec2Dash, 'deploymentStage', deploymentStage);
