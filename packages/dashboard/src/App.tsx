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

Auth.configure({
  userPoolId: 'eu-west-1_BFo2qet9Y',
  region: 'eu-west-1',
  userPoolWebClientId: '5j90aqphn901qs9789c2lnd7mu',
});

export default withAuthenticator(App);
