import { IEc2Instance } from 'ec2-dash-models';
import React from 'react';
import { Card } from 'react-bootstrap';

interface IInstanceCardProps {
  instance: IEc2Instance;
}

const InstanceCard: React.FC<IInstanceCardProps> = (props) => {
  return (
    <Card>
      <Card.Title>{props.instance.name}</Card.Title>
      <Card.Subtitle>{props.instance.id}</Card.Subtitle>
    </Card>
  );
};

export default InstanceCard;
