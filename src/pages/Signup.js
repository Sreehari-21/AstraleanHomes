import { API_URL } from "../config";
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Send OTP to either Email or Phone (Mocked on backend)
      const identity = email || phone;
      await axios.post(`${API_URL}/api/auth/send-otp`, { identity });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const identity = email || phone;
      // Step 2: Verify OTP
      const verifyRes = await axios.post(`${API_URL}/api/auth/verify-otp`, { identity, otp });
      
      if (verifyRes.data.success) {
        // Step 3: Finalize Registration
        await axios.post(`${API_URL}/api/auth/register`, { email, phone, password });
        
        // Step 4: Auto-login
        const loginRes = await axios.post(`${API_URL}/api/auth/login`, { identity, password });
        if (loginRes.data.token) {
          login(loginRes.data.token);
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-hero-wrapper">
      <section className="page-hero-section signup-hero">
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content auth-hero-content">
          <div className="login-container auth-page-container">
            <div className="login-card auth-card">
              <h2>{step === 1 ? 'Sign Up' : 'Verify Identity'}</h2>
              {error && <div className="error-message">{error}</div>}
              
              {step === 1 ? (
                <form onSubmit={handleSendOTP} className="auth-form">
                  <div className="form-group">
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      className="auth-input"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group password-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="auth-input"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      )}
                    </button>
                  </div>
                  <div className="form-group password-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="auth-input"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      )}
                    </button>
                  </div>
                  <button type="submit" className="signup-btn auth-btn" disabled={loading}>
                    {loading ? 'Sending Code...' : 'Continue'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyAndSignup} className="auth-form">
                  <p className="otp-instruction">
                    Enter the 6-digit code sent to your {email ? 'email' : 'phone'}.
                    <br />
                    <small style={{ color: '#666' }}>(Check server console for mock OTP)</small>
                  </p>
                  <div className="form-group">
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength="6"
                      required
                    />
                  </div>
                  <button type="submit" className="signup-btn auth-btn" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Sign Up'}
                  </button>
                  <button 
                    type="button" 
                    className="auth-link-btn" 
                    onClick={() => setStep(1)}
                    style={{ background: 'none', border: 'none', padding: '10px', width: '100%' }}
                  >
                    Back to Edit Info
                  </button>
                </form>
              )}
              
              <p className="auth-footer">
                Already have an account? <Link to="/login" className="auth-link">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
