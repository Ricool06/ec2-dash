import { IEc2Instance } from 'ec2-dash-models';
import { shallow } from 'enzyme';
import React from 'react';
import { Card } from 'react-bootstrap';
import InstanceCard from './InstanceCard';

describe('InstanceCard', () => {
  const testInstance: IEc2Instance = {
    id: 'i-12345678',
    name: 'starbound-server',
  };

  it('should display the name of the instance passed to it', () => {
    const wrapper = shallow(<InstanceCard instance={testInstance} />);

    expect(wrapper.find(Card.Title).props().children).toBe(testInstance.name);
  });

  it('should display the id of the instance passed to it', () => {
    const wrapper = shallow(<InstanceCard instance={testInstance} />);

    expect(wrapper.find(Card.Subtitle).props().children).toBe(testInstance.id);
  });
});
