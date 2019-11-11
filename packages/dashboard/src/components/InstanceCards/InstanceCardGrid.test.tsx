import { IEc2Instance } from 'ec2-dash-models';
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import * as effects from '../../effects';
import InstanceCard from './InstanceCard';
import InstanceCardGrid from './InstanceCardGrid';

jest.mock('../../effects');
jest.useFakeTimers();

describe('InstanceCardGrid', () => {
  const baseUrl = 'https://base.url';
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

  it('should fetch and show instances on startup', async () => {
    const getInstancesSpy = jest.spyOn(effects, 'getInstances');
    getInstancesSpy.mockResolvedValue(testInstances);

    const expectedElements = testInstances
      .map((instance) => <InstanceCard key={instance.id} instance={instance} />);

    const wrapper = mount(<InstanceCardGrid apiBaseUrl={baseUrl} />);
    await act(async () => { jest.runAllTimers(); });
    wrapper.update();

    expect(getInstancesSpy).toHaveBeenCalledWith(baseUrl);
    expect(wrapper.containsAllMatchingElements(expectedElements)).toBeTruthy();
  });
});
