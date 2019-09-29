import { EC2 } from 'aws-sdk';
import { IEc2Instance } from '../models';

const mapResultToInstanceArray = (data: EC2.DescribeInstancesResult): IEc2Instance[] => {
  return data.Reservations.map(reservation =>
    reservation.Instances.map(instance => ({
      id: instance.InstanceId,
      name: instance.Tags.find(tag => tag.Key.toLowerCase() === 'name').Value
    } as IEc2Instance)
  )).reduce((builder, current) => builder.concat(current));
};

export const fetchEc2Instances = (
  ec2Service: EC2,
  NextToken: string = undefined,
  firstCall: boolean = true
): Promise<IEc2Instance[]> => {
  return new Promise((resolve, reject) => {
    if (!firstCall && !NextToken) {
      resolve([]);
    } else {
      ec2Service.describeInstances({NextToken}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          fetchEc2Instances(ec2Service, NextToken = data.NextToken, firstCall = false)
            .then(newInstances => resolve(mapResultToInstanceArray(data).concat(newInstances)))
            .catch(reject);
        }
      });
    }
  });
};
