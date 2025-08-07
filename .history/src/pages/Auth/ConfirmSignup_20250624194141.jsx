import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmUser, resendConfirmationCode } from '../../utils/auth/confirm';

export default function ConfirmSignup() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleConfirm = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await confirmUser(email, code);
      setMsg('Confirmation successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      setMsg(`Confirmation failed: ${err.message}`);
    }
  };

  const handleResend = async () => {
    setMsg('');
    try {
      await resendConfirmationCode(email);
      setMsg('Confirmation code resent. Please check your email.');
    } catch (err) {
      setMsg(`Resend failed: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5 text-light">
      <h2>Confirm Account</h2>
      <form onSubmit={handleConfirm}>
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
          type="text"
          placeholder="Confirmation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button className="btn btn-light mt-2" type="submit">Confirm</button>
        <button
          type="button"
          className="btn btn-outline-light mt-2 ms-2"
          onClick={handleResend}
        >
          Resend Code
        </button>
        {msg && <p className="mt-3">{msg}</p>}
      </form>
    </div>
  );
}
