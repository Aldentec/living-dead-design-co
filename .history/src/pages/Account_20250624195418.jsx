import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Pool from '../awsCognito';

export default function Account() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    const cognitoUser = Pool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
      setUser(null);
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="container mt-5 text-light">
        <h2>Account</h2>
        <p>You must be signed in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 text-light">
      <h2>Account</h2>
      <p><strong>Email:</strong> {user.getUsername()}</p>
      <button className="btn btn-light mt-3" onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
