import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-west-2_cD03H3RU5',
  ClientId: '7gu4c34jdf1ogngkr3hdo8fnqo',
};

export default new CognitoUserPool(poolData);
