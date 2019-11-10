import Auth from '@aws-amplify/auth';
import { AuthOptions } from '@aws-amplify/auth/lib-esm/types';
import awsAmplifyReact from 'aws-amplify-react';
import { shallow } from 'enzyme';
import React from 'react';
import App from './App';
import InstanceCardGrid from './components/InstanceCards/InstanceCardGrid';

jest.mock('@aws-amplify/auth', () => {
  return {
    configure: jest.fn(),
  };
});
jest.mock('aws-amplify-react', () => {
  return {
    withAuthenticator: jest.fn((i) => i),
  };
});

describe('App', () => {
  let configureSpy: jest.SpyInstance<AuthOptions>;

  beforeEach(() => {
    configureSpy = jest.spyOn(Auth, 'configure');
    configureSpy.mockImplementation();

    const withAuthenticatorSpy = jest.spyOn(awsAmplifyReact, 'withAuthenticator');
    withAuthenticatorSpy.mockImplementation((i) => i);
  });

  it('renders without crashing', () => {
    shallow(<App />);
  });

  it('should contain a grid of instance cards', () => {
    const expectedApiBaseUrl = (window as any)._ec2DashConfig.apiBaseUrl;
    
    const wrapper = shallow(<App />);

    expect(wrapper.contains(<InstanceCardGrid apiBaseUrl={expectedApiBaseUrl} />)).toBeTruthy();
  });
});
