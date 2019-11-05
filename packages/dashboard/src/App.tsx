import Auth from '@aws-amplify/auth';
import { withAuthenticator } from 'aws-amplify-react';
import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      You're logged in!
    </div>
  );
};

const ec2DashConfig = (window as any)._ec2DashConfig;

Auth.configure({
  region: ec2DashConfig.cognitoRegion,
  userPoolId: ec2DashConfig.cognitoUserPoolId,
  userPoolWebClientId: ec2DashConfig.cognitoUserPoolClientId,
});
export default withAuthenticator(App);
