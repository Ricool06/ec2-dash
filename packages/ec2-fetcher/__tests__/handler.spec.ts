import { APIGatewayProxyResult } from 'aws-lambda';
import { IEc2Instance } from 'ec2-dash-models';
import { handler } from '../src/handler';

jest.mock('aws-sdk');

let mockFetchEc2Instances;
jest.mock('../src/core/fetch-ec2-instances', () => ({
  fetchEc2Instances: () => mockFetchEc2Instances()
}));

describe('handler', () => {
  it('should return an API gateway result containing ec2 instances', async () => {
    const fakeInstances: IEc2Instance[] = [ { id: 'i-someec2instance', name: 'Trevor' } ];
    mockFetchEc2Instances = async () => fakeInstances;

    const expectedResponse: APIGatewayProxyResult = {
      body: JSON.stringify(fakeInstances),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 200
    };

    const sut = handler.bind(handler, {}, {});

    expect(await sut()).toEqual(expectedResponse);
  });

  it('should respond with internal server error when it cannot fetch EC2 instances', async () => {
    const expectedError = new Error('AWS is dead :(');
    mockFetchEc2Instances = () => new Promise((_, reject) => reject(expectedError));

    const expectedResponse: APIGatewayProxyResult = {
      body: JSON.stringify({ error: expectedError.message }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: 500
    };

    const sut = handler.bind(handler, {}, {});

    expect(await sut()).toEqual(expectedResponse);
  });
});
