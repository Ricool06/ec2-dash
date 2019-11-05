import { shallow } from 'enzyme';
import React from 'react';
import InstanceCardGrid from './InstanceCardGrid';

describe('InstanceCardGrid', () => {
  const baseUrl = 'https://base.url';

  it('should fetch and show instances on startup', () => {
    const wrapper = shallow(<InstanceCardGrid ec2DashApiBaseUrl={baseUrl} />);

    
  });
});
