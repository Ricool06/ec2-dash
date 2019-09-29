import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../src/handler';
import { IEc2Instance } from '../src/models';

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
      statusCode: 500
    };

    const sut = handler.bind(handler, {}, {});

    expect(await sut()).toEqual(expectedResponse);
  });
});
