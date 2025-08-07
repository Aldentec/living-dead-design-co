import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-west-2_Ror00XUYV',
  ClientId: '1mr98r89931sqintl2796nqsb5',
};

export default new CognitoUserPool(poolData);
