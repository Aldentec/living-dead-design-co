import {
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import Pool from '../../awsCognito';

export const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => resolve(data),
      onFailure: (err) => reject(err),
    });
  });
};
