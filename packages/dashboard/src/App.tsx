import Auth from '@aws-amplify/auth';
import { withAuthenticator } from 'aws-amplify-react';
import React from 'react';
import './App.css';
import InstanceCardGrid from './components/InstanceCards/InstanceCardGrid';

const ec2DashConfig = (window as any)._ec2DashConfig;

Auth.configure({
  region: ec2DashConfig.cognitoRegion,
  userPoolId: ec2DashConfig.cognitoUserPoolId,
  userPoolWebClientId: ec2DashConfig.cognitoUserPoolClientId,
});

const App: React.FC = () => {
  return (
    <InstanceCardGrid apiBaseUrl={ec2DashConfig.apiBaseUrl} />
  );
};

export default withAuthenticator(App);
