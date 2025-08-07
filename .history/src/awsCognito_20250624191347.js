import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-west-2_cD03H3RU5',
  ClientId: '1md748mfu30krdrkmpqcpgof3g',
};

export default new CognitoUserPool(poolData);
