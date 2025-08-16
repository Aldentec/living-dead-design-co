import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../../utils/auth/signin';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const result = await signIn(formData.email, formData.password);
      const idToken = result.getIdToken().getJwtToken();
      localStorage.setItem('idToken', idToken);
      
      setMessage('Login successful! Redirecting...');
      setMessageType('success');
      
      // Small delay to show success message
      setTimeout(() => {
        navigate('/shop');
        if (onLogin) onLogin(idToken);
      }, 1000);
      
    } catch (err) {
      setMessage(`Login failed: ${err.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="container-modern">
        <div className="auth-wrapper">
          {/* Background Decoration */}
          <div className="auth-decoration">
            <div className="auth-circle auth-circle-1"></div>
            <div className="auth-circle auth-circle-2"></div>
            <div className="auth-circle auth-circle-3"></div>
          </div>

          {/* Login Form */}
          <div className="auth-form-container">
            <div className="auth-header">
              <div className="auth-icon">
                🔑
              </div>
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">
                Sign in to your Living Dead Design Co. account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <circle cx="12" cy="16" r="1"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`auth-message auth-message-${messageType}`}>
                  <div className="auth-message-icon">
                    {messageType === 'success' && '✅'}
                    {messageType === 'error' && '❌'}
                    {messageType === 'info' && 'ℹ️'}
                  </div>
                  <span>{message}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="auth-spinner"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>

              {/* Forgot Password Link */}
              <div className="auth-forgot">
                <Link to="/forgot-password" className="auth-link">
                  Forgot your password?
                </Link>
              </div>
            </form>

            {/* Sign Up CTA */}
            <div className="auth-footer">
              <div className="auth-divider">
                <span>New to Living Dead Design Co.?</span>
              </div>
              <Link to="/signup" className="btn btn-outline btn-lg auth-signup">
                <span>Create Account</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Side Panel */}
          <div className="auth-side-panel">
            <div className="auth-side-content">
              <div className="auth-side-icon">
                💀
              </div>
              <h2>Join Our Dark Family</h2>
              <p>
                Access exclusive designs, track your orders, and be the first to know about new releases from our dark collection.
              </p>
              
              <div className="auth-features">
                <div className="auth-feature">
                  <span className="auth-feature-icon">🛍️</span>
                  <span>Exclusive member pricing</span>
                </div>
                <div className="auth-feature">
                  <span className="auth-feature-icon">📦</span>
                  <span>Order tracking & history</span>
                </div>
                <div className="auth-feature">
                  <span className="auth-feature-icon">🎨</span>
                  <span>Early access to new designs</span>
                </div>
                <div className="auth-feature">
                  <span className="auth-feature-icon">💌</span>
                  <span>Personalized recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}