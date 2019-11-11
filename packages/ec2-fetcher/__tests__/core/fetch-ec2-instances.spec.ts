import * as aws from 'aws-sdk';
import * as awsMock from 'aws-sdk-mock';
import { fakeDescribeInstancesResult, fakeDescribeInstancesResultWithNextToken } from '../../__mocks__/test-data';
import { fetchEc2Instances } from '../../src/core/fetch-ec2-instances';
import { IEc2Instance } from '../../src/models';

describe('fetch-ec2-instances', () => {
  it('should return a list of all ec2 instances', async () => {
    awsMock.mock('EC2', 'describeInstances', (_, callback) => callback(null, fakeDescribeInstancesResult));
    const ec2 = new aws.EC2();

    const expectedResult: IEc2Instance[] = fakeDescribeInstancesResult.Reservations
      .map(reservation => reservation.Instances
        .map(instance => ({
          id: instance.InstanceId,
          name: instance.Tags.find(tag => tag.Key.toLowerCase() === 'name').Value
        } as IEc2Instance)
      )
    ).reduce((builder, current) => builder.concat(current));

    const actualResult = await fetchEc2Instances(ec2);

    expect(actualResult).toEqual(expectedResult);
  });

  it('should handle pagination of ec2 instances', async () => {
    const getNextResult = jest.fn()
      .mockReturnValueOnce(fakeDescribeInstancesResultWithNextToken)
      .mockReturnValueOnce(fakeDescribeInstancesResult);

    awsMock.mock('EC2', 'describeInstances', (_, callback) => callback(null, getNextResult()));
    const ec2 = new aws.EC2();

    const expectedResult: IEc2Instance[] = fakeDescribeInstancesResultWithNextToken.Reservations
      .concat(fakeDescribeInstancesResult.Reservations)
      .map(reservation => reservation.Instances
        .map(instance => ({
          id: instance.InstanceId,
          name: instance.Tags.find(tag => tag.Key.toLowerCase() === 'name').Value
        } as IEc2Instance)
      )
    ).reduce((builder, current) => builder.concat(current));

    const actualResult = await fetchEc2Instances(ec2);

    expect(actualResult).toEqual(expectedResult);
  });

  it('should reject on error', async () => {
    const expectedError = new Error('AWS is dead :(');
    awsMock.mock('EC2', 'describeInstances', (_, callback) => callback(expectedError, null));
    const ec2 = new aws.EC2();

    await expect(fetchEc2Instances(ec2)).rejects.toBe(expectedError);
  });

  it('should reject on error after first page', async () => {
    const expectedError = new Error('AWS is dead :(');

    const getNextCallbackArgs = jest.fn()
      .mockReturnValueOnce([null, fakeDescribeInstancesResultWithNextToken])
      .mockReturnValueOnce([expectedError, null]);

    awsMock.mock('EC2', 'describeInstances', (_, callback) => callback(...getNextCallbackArgs()));
    const ec2 = new aws.EC2();

    await expect(fetchEc2Instances(ec2)).rejects.toBe(expectedError);
  });

  beforeEach(() => {
    awsMock.setSDKInstance(aws);
  });

  afterEach(() => {
    awsMock.restore('EC2');
  });
});
