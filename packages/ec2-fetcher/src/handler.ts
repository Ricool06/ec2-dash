import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { EC2 } from 'aws-sdk';
import 'source-map-support/register';
import { fetchEc2Instances } from './core/fetch-ec2-instances';
import { IEc2Instance } from './models';

const ec2Service = new EC2();
const boundFetchEc2Instances: () => Promise<IEc2Instance[]> = fetchEc2Instances
  .bind(fetchEc2Instances, ec2Service);

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const result: APIGatewayProxyResult = {
    body: '',
    statusCode: 500,
  };

  try {
    const instances = await boundFetchEc2Instances();

    result.body = JSON.stringify(instances);
    result.statusCode = 200;
  } catch (error) {
    result.body = JSON.stringify({ error: error.message });
    result.statusCode = 500;
  }

  return result;
};
