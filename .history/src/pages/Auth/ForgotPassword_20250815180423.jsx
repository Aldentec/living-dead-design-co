import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import Pool from '../../awsCognito';

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: ''
  });
  const [codeSent, setCodeSent] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const getUser = () => new CognitoUser({ Username: formData.email, Pool });

  const handleRequestCode = (e) => {
    e.preventDefault();
    setMsg('');
    setMsgType('');
    setIsLoading(true);

    const user = getUser();
    user.forgotPassword({
      onSuccess: () => {
        setMsg('Verification code sent. Please check your email.');
        setMsgType('success');
        setCodeSent(true);
      },
      onFailure: (err) => {
        setMsg(`Request failed: ${err.message}`);
        setMsgType('error');
      },
      onCompleteCallback: () => {
        setIsLoading(false);
      }
    });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setMsg('');
    setMsgType('');
    setIsLoading(true);

    const user = getUser();
    user.confirmPassword(formData.code, formData.newPassword, {
      onSuccess: () => {
        setMsg('Password reset successful! Redirecting to login...');
        setMsgType('success');
        setTimeout(() => navigate('/login'), 2000);
      },
      onFailure: (err) => {
        setMsg(`Reset failed: ${err.message}`);
        setMsgType('error');
        setIsLoading(false);
      }
    });
  };

  const handleBackToEmail = () => {
    setCodeSent(false);
    setMsg('');
    setMsgType('');
    setFormData(prev => ({ ...prev, code: '', newPassword: '' }));
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
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                </svg>
              </div>
              <h1 className="auth-title">
                {!codeSent ? 'Reset Password' : 'Enter New Password'}
              </h1>
              <p className="auth-subtitle">
                {!codeSent 
                  ? 'Enter your email address and we\'ll send you a verification code'
                  : 'Enter the verification code and your new password'
                }
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

            {/* Email Form - Step 1 */}
            {!codeSent ? (
              <form onSubmit={handleRequestCode} className="auth-form">
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
                      placeholder="Enter your email address"
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

                <button 
                  type="submit" 
                  className="btn btn-primary auth-submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="auth-spinner"></div>
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12,5 19,12 12,19"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Reset Password Form - Step 2 */
              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="form-group">
                  <label htmlFor="code" className="form-label">
                    Verification Code
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="code"
                      name="code"
                      type="text"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter verification code"
                      required
                      disabled={isLoading}
                      autoComplete="one-time-code"
                    />
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <circle cx="12" cy="16" r="1"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter your new password"
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
                      onClick={toggleNewPasswordVisibility}
                      disabled={isLoading}
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {showNewPassword ? (
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

                <button 
                  type="submit" 
                  className="btn btn-primary auth-submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="auth-spinner"></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    </>
                  )}
                </button>

                {/* Back Button */}
                <button 
                  type="button"
                  onClick={handleBackToEmail}
                  className="btn btn-secondary auth-submit"
                  disabled={isLoading}
                  style={{ marginTop: 'var(--space-3)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6"/>
                  </svg>
                  Back to Email
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="auth-footer">
              <div className="auth-divider">
                <span>Remember your password?</span>
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
                Back to Sign In
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="auth-side-panel">
            <div className="auth-side-content">
              <h3>Password Recovery</h3>
              <p>
                Regain access to your Living Dead Design Co. account and continue 
                your dark creative journey. We'll help you reset your password securely.
              </p>
              
              <div className="auth-features">
                <div className="auth-feature">
                  <div className="feature-icon">🔒</div>
                  <div>
                    <h4>Secure Process</h4>
                    <p>Your security is our top priority</p>
                  </div>
                </div>
                
                <div className="auth-feature">
                  <div className="feature-icon">📧</div>
                  <div>
                    <h4>Email Verification</h4>
                    <p>Verification code sent to your email</p>
                  </div>
                </div>
                
                <div className="auth-feature">
                  <div className="feature-icon">⚡</div>
                  <div>
                    <h4>Quick Recovery</h4>
                    <p>Get back to creating in minutes</p>
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