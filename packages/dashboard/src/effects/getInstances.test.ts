import Auth, { AuthClass } from '@aws-amplify/auth';
import axios, { AxiosRequestConfig } from 'axios';
import { IEc2Instance } from 'ec2-dash-models';
import { getInstances } from './getInstances';
import { CognitoUserSession, CognitoIdToken } from 'amazon-cognito-identity-js';
import { async } from 'q';

jest.mock('axios');
jest.mock('@aws-amplify/auth');

describe('getInstances', () => {
  const baseURL = 'https://base.url';
  const testInstances: IEc2Instance[] = [
    {
      id: 'i-12345678',
      name: 'starbound-server',
    },
    {
      id: 'i-22345678',
      name: 'ark-server',
    },
    {
      id: 'i-32345678',
      name: 'gmod-server',
    },
  ];
  const testJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    + '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
    + '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  it('should fetch instances from the base url it is passed', async () => {
    const expectedConfig: AxiosRequestConfig = {
      baseURL,
      headers: {
        Authorization: testJwt,
      },
    };

    const fakeSession = {
      getIdToken: () => ({
        getJwtToken: () => testJwt,
      }),
    } as CognitoUserSession;

    const axiosSpy = jest.spyOn(axios, 'get');
    axiosSpy.mockResolvedValue(testInstances);

    const currentSessionSpy = jest.spyOn(Auth, 'currentSession');
    currentSessionSpy.mockResolvedValue(fakeSession);

    const result = await getInstances(baseURL);

    expect(result).toBe(testInstances);
    expect(axiosSpy).toHaveBeenCalledWith('/instances', expectedConfig);
  });
});
