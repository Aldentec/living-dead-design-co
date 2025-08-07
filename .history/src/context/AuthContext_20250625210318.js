import { createContext, useContext, useEffect, useState } from 'react';
import Pool from '../awsCognito';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [rawUser, setRawUser] = useState(null); // original Cognito object
  const [user, setUser] = useState(null);       // simplified data object

  useEffect(() => {
    const cognitoUser = Pool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.getSession((err, session) => {
        if (!err && session.isValid()) {
          const idToken = session.getIdToken().getJwtToken();
          const payload = JSON.parse(atob(idToken.split('.')[1]));
          const groups = payload['cognito:groups'] || [];

          setRawUser(cognitoUser);
          setUser({
            email: payload.email,
            isAdmin: groups.includes('admin'),
            idToken,
          });
        }
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, rawUser, setRawUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
