import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../utils/auth/signup';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

        <div className="input-group my-2">
          <input
            className="form-control"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈 Hide' : '👁️ Show'}
          </button>
        </div>

        <button className="btn btn-light mt-2" type="submit">Sign Up</button>
        {msg && <p className="mt-3">{msg}</p>}
      </form>
    </div>
  );
}
