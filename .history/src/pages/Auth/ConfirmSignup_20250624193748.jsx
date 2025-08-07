// src/pages/ConfirmSignup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import Pool from '../../awsCognito';

export default function ConfirmSignup() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConfirm = (e) => {
    e.preventDefault();
    const user = new CognitoUser({
      Username: email,
      Pool,
    });

    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
      } else {
        navigate('/login');
      }
    });
  };

  return (
    <div className="container mt-5">
      <h2>Confirm Your Email</h2>
      <form onSubmit={handleConfirm}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Confirmation Code</label>
          <input type="text" className="form-control"
            value={code} onChange={(e) => setCode(e.target.value)} required />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">Confirm</button>
      </form>
    </div>
  );
}
