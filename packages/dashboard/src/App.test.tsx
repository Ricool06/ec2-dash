import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Auth from '@aws-amplify/auth';
import { AuthOptions } from '@aws-amplify/auth/lib-esm/types';
import { shallow } from 'enzyme';

describe('App', () => {
  (window as any)._ec2DashConfig = {
    cognitoRegion: 'eu-central-1',
    cognitoUserPoolClientId: 'cognitoUserPoolClientId1',
    cognitoUserPoolId: 'cognitoUserPoolId1',
  };
  let configureSpy: jest.SpyInstance<AuthOptions>;

  beforeEach(() => {
    configureSpy = jest.spyOn(Auth, 'configure');
    configureSpy.mockImplementation();
  });

  it('renders without crashing', () => {
    shallow(<App />);
  });
});
