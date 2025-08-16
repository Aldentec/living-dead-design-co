import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../utils/auth/signup';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setMsgType('');
    setIsLoading(true);

    try {
      await signUp(formData.email, formData.password);
      setMsg('Signup successful! Please check your email to confirm your account.');
      setMsgType('success');
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/confirm');
      }, 2000);
    } catch (err) {
      setMsg(`Signup failed: ${err.message}`);
      setMsgType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="container-modern">
        <div className="auth-wrapper">
          <div className="auth-form-container">
            {/* Header */}
            <div className="auth-header">
              <div className="auth-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">
                Join Living Dead Design Co. and bring your darkest visions to life
              </p>
            </div>

            {/* Message Display */}
            {msg && (
              <div className={`auth-message ${msgType === 'success' ? 'auth-message-success' : 'auth-message-error'}`}>
                <div className="auth-message-icon">
                  {msgType === 'success' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  )}
                </div>
                {msg}
              </div>
            )}

            {/* Form */}
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
                    autoComplete="email"
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
                    placeholder="Create a strong password"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L6 6l6 6 6 6 6-6"/>
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

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="auth-spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12,5 19,12 12,19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="auth-footer">
              <div className="auth-divider">
                <span>Already have an account?</span>
              </div>
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="btn btn-secondary auth-signup"
                disabled={isLoading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10,17 15,12 10,7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="auth-side-panel">
            <div className="auth-side-content">
              <h3>Join the Dark Side</h3>
              <p>
                Create unique, haunting designs that capture the essence of the macabre. 
                From custom illustrations to personalized horror merchandise, your darkest 
                creative visions await.
              </p>
              
              <div className="auth-features">
                <div className="auth-feature">
                  <div className="feature-icon">🎨</div>
                  <div>
                    <h4>Custom Artwork</h4>
                    <p>Personalized horror-themed designs</p>
                  </div>
                </div>
                
                <div className="auth-feature">
                  <div className="feature-icon">💀</div>
                  <div>
                    <h4>Exclusive Gallery</h4>
                    <p>Access to our complete collection</p>
                  </div>
                </div>
                
                <div className="auth-feature">
                  <div className="feature-icon">🚀</div>
                  <div>
                    <h4>Priority Orders</h4>
                    <p>Fast-tracked custom commissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="auth-decoration">
          <div className="auth-circle auth-circle-1"></div>
          <div className="auth-circle auth-circle-2"></div>
          <div className="auth-circle auth-circle-3"></div>
        </div>
      </div>
    </div>
  );
}