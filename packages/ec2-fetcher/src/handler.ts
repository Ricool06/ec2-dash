import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const result: APIGatewayProxyResult = {
    body: '',
    statusCode: 200,
  };
  return result;
};
