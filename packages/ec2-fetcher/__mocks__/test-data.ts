import { EC2 } from 'aws-sdk';
import { Chance } from 'chance';

const chance = new Chance();

const makeInstance = (): Partial<EC2.Instance> => ({
  InstanceId: chance.word(),
  Tags: [
    {
      Key: 'Name',
      Value: chance.name(),
    }
  ]
});

const makeInstances = (): Array<Partial<EC2.Instance>> =>
  Array.from(
    {length: chance.integer({min: 2, max: 4})},
    makeInstance
  );

const makeReservation = (): EC2.Reservation =>
  ({ Instances: makeInstances() });

const makeReservations = (): EC2.Reservation[] =>
  Array.from(
    {length: chance.integer({min: 2, max: 4})},
    makeReservation
  );

export const fakeDescribeInstancesResult: EC2.DescribeInstancesResult = {
  Reservations: makeReservations()
};

export const fakeDescribeInstancesResultWithNextToken: EC2.DescribeInstancesResult = {
  NextToken: 'someNextToken',
  Reservations: makeReservations(),
};
