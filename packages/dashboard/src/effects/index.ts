import Auth from '@aws-amplify/auth';
import axios from 'axios';
import { IEc2Instance } from 'ec2-dash-models';

export const getInstances = async (baseURL: string): Promise<IEc2Instance[]> => {
  const session = await Auth.currentSession();
  const jwt = session.getIdToken().getJwtToken();

  return axios.get('/instances', {
    baseURL,
    headers: {
      Authorization: jwt,
    },
  });
};
