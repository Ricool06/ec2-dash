#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { Aws } from '@aws-cdk/core';
import 'source-map-support/register';
import { AuthStack } from '../lib/auth-stack';
import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();
const authStack = new AuthStack(app, 'AuthStack', {
  env: {
    account: Aws.ACCOUNT_ID,
    region: 'eu-west-1',
  },
});

const frontendStack = new FrontendStack(app, 'FrontendStack', {
  env: {
    account: Aws.ACCOUNT_ID,
    region: 'eu-west-1',
  },
});

frontendStack.addDependency(authStack);
