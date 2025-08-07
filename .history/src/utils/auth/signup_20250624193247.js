import Pool from '../../awsCognito';
import {
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

export const signUp = (email, password) => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'custom:role', Value: 'user' }),
      new CognitoUserAttribute({ Name: 'name.formatted', Value: 'Test User' }) // or use real name input
    ];

    Pool.signUp(email, password, attributeList, null, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
