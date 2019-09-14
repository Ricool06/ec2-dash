import React from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react';
import Auth from '@aws-amplify/auth';

const App: React.FC = () => {
  return (
    <div className="App">
      You're logged in!
    </div>
  );
}

const ec2DashConfig = (window as any)._ec2DashConfig;

Auth.configure({
  userPoolId: ec2DashConfig['cognitoUserPoolId'],
  region: ec2DashConfig['cognitoRegion'],
  userPoolWebClientId: ec2DashConfig['cognitoUserPoolClientId'],
});

export default withAuthenticator(App);
