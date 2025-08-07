import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-west-2_IjBTDx5uG',
  ClientId: '4m31g0tqbc6hsb52l2g9mqti2e',
};

export default new CognitoUserPool(poolData);
