import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import Pool from '../../awsCognito';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const getUser = () => new CognitoUser({ Username: email, Pool });

  const handleRequestCode = (e) => {
    e.preventDefault();
    setMsg('');

    const user = getUser();
    user.forgotPassword({
      onSuccess: () => {
        setMsg('Verification code sent. Please check your email.');
        setCodeSent(true);
      },
      onFailure: (err) => setMsg(`Request failed: ${err.message}`),
    });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setMsg('');

    const user = getUser();
    user.confirmPassword(code, newPassword, {
      onSuccess: () => setMsg('Password reset successful! You can now log in.'),
      onFailure: (err) => setMsg(`Reset failed: ${err.message}`),
    });
  };

  return (
    <div className="container mt-5 text-light">
      <h2>Forgot Password</h2>
      {!codeSent ? (
        <form onSubmit={handleRequestCode}>
          <input
            className="form-control my-2"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-light mt-2" type="submit">Send Reset Code</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input
            className="form-control my-2"
            type="text"
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <input
            className="form-control my-2"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button className="btn btn-light mt-2" type="submit">Reset Password</button>
        </form>
      )}
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
