import { IEc2Instance } from 'ec2-dash-models';
import React, { useEffect, useState } from 'react';
import { getInstances } from '../../effects';
import InstanceCard from './InstanceCard';
import { CardColumns } from 'react-bootstrap';

interface IInstanceCardGridProps {
  apiBaseUrl: string;
}

const InstanceCardGrid: React.FC<IInstanceCardGridProps> = (props) => {
  const [instances, setInstances] = useState([] as IEc2Instance[]);

  const refreshInstances = async () => {
    const newInstances = await getInstances(props.apiBaseUrl);
    setInstances(newInstances);
  };

  useEffect(() => {
    refreshInstances();
  }, []);

  const instanceCards = instances
    .map((instance) => (<InstanceCard key={instance.id} instance={instance} />));

  return (<CardColumns>
    {instanceCards}
  </CardColumns>);
};

export default InstanceCardGrid;
