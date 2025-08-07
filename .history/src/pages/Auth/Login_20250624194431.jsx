import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../utils/auth/signin';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const result = await signIn(email, password);
      const idToken = result.getIdToken().getJwtToken();
      localStorage.setItem('idToken', idToken);
      navigate('/shop');
      setMsg('Login successful!');
      if (onLogin) onLogin(idToken);
    } catch (err) {
      setMsg(`Login failed: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5 text-light">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control my-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="form-control my-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-light mt-2" type="submit">Log In</button>
        {msg && <p className="mt-3">{msg}</p>}
      </form>
    </div>
  );
}
