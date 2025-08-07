import React, { useState } from 'react';
import { signUp } from '../../utils/auth/signup';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      await signUp(email, password);
      setMsg('Signup successful! Please check your email to confirm your account.');
      navigate('/confirm');
    } catch (err) {
      setMsg(`Signup failed: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5 text-light">
      <h2>Sign Up</h2>
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
        <button className="btn btn-light mt-2" type="submit">Sign Up</button>
        {msg && <p className="mt-3">{msg}</p>}
      </form>
    </div>
  );
}
