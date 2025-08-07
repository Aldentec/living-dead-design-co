import { createContext, useContext, useEffect, useState } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import Pool from '../awsCognito';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cognitoUser = Pool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.getSession((err, session) => {
        if (!err && session.isValid()) {
          const idToken = session.getIdToken().getJwtToken();

          // Decode the token to check groups
          const payload = JSON.parse(atob(idToken.split('.')[1]));
          const groups = payload['cognito:groups'] || [];

          console.log("PAYLOAD: " + payload)
          console.log("GROUPS: " + groups)

          setUser({
            ...cognitoUser,
            idToken,
            isAdmin: groups.includes('admin'),
          });
        }
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
