import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('@aws-amplify/core/lib/Logger/ConsoleLogger.js');
global._ec2DashConfig = {
  apiBaseUrl: 'https://some.url',
  cognitoRegion: 'eu-central-1',
  cognitoUserPoolClientId: 'cognitoUserPoolClientId1',
  cognitoUserPoolId: 'cognitoUserPoolId1',
};
