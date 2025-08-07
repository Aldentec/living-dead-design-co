import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-west-2_LMQrmqNTP',
  ClientId: '19dva211frsrgsrin4speb6kje',
};

export default new CognitoUserPool(poolData);
