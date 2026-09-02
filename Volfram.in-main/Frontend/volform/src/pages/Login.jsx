import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, setAccessToken } from "../services/api";

function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await authAPI.login(email, password);
      setAccessToken(response.accessToken);
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');

        .vl-root {
          width: 100%;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f2f5f8 0%, #e8edf3 100%);
          padding: 60px 20px;
          font-family: 'Barlow', sans-serif;
          box-sizing: border-box;
        }

        .vl-root *, .vl-root *::before, .vl-root *::after {
          box-sizing: border-box;
        }

        .vl-card {
          width: 100%;
          max-width: 480px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 48px rgba(15,45,77,0.12), 0 2px 12px rgba(15,45,77,0.06);
          border: 1px solid #d5dee7;
          overflow: hidden;
        }

        /* Top accent strip */
        .vl-card-top {
          height: 5px;
          background: linear-gradient(90deg, #0f2d4d 0%, #146c8a 50%, #d9732d 100%);
        }

        .vl-body {
          padding: 44px 44px 36px;
        }

        /* Logo plate */
        .vl-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        .vl-logo-plate {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #0f2d4d, #146c8a);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(15,45,77,0.25);
        }
        .vl-logo-name {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #0f2d4d;
          letter-spacing: -0.3px;
        }
        .vl-logo-dot {
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #d9732d;
          margin-left: 2px;
          vertical-align: super;
        }

        .vl-heading {
          font-family: 'Sora', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #0f2d4d;
          line-height: 1.15;
          margin: 0 0 6px 0;
        }

        .vl-sub {
          font-size: 14px;
          color: #70879b;
          margin: 0 0 32px 0;
        }

        /* Error box */
        .vl-error {
          background: #fff5f5;
          border: 1px solid #fca5a5;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 14px;
          color: #c0392b;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Field */
        .vl-field {
          margin-bottom: 20px;
        }

        .vl-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #455b70;
          margin-bottom: 7px;
          transition: color 0.2s;
        }

        .vl-field.is-focused .vl-label { color: #146c8a; }

        .vl-input-wrap { position: relative; }

        .vl-input-wrap input {
          width: 100%;
          padding: 13px 14px 13px 44px;
          border: 1.5px solid #d5dee7;
          border-radius: 10px;
          font-family: 'Barlow', sans-serif;
          font-size: 15px;
          color: #0f2d4d;
          outline: none;
          transition: all 0.2s;
          background: #fff;
        }

        .vl-input-wrap input::placeholder { color: #a3b5c3; }

        .vl-input-wrap input:focus {
          border-color: #146c8a;
          box-shadow: 0 0 0 3px rgba(20,108,138,0.1);
        }

        .vl-field.is-focused .vl-input-wrap input {
          border-color: #146c8a;
          box-shadow: 0 0 0 3px rgba(20,108,138,0.1);
        }

        .vl-icon {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          color: #a3b5c3;
          pointer-events: none;
          transition: color 0.2s;
        }

        .vl-field.is-focused .vl-icon { color: #146c8a; }

        /* Forgot row */
        .vl-forgot-row {
          text-align: right;
          margin-top: -10px;
          margin-bottom: 28px;
        }
        .vl-forgot-row span {
          font-size: 13px;
          color: #a3b5c3;
        }

        /* Submit button */
        .vl-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #0f2d4d 0%, #146c8a 100%);
          border: none;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.25s;
          box-shadow: 0 6px 24px rgba(15,45,77,0.28);
          letter-spacing: 0.3px;
        }

        .vl-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.2s;
        }
        .vl-btn:hover::after { background: rgba(255,255,255,0.08); }
        .vl-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 32px rgba(15,45,77,0.34); }
        .vl-btn:active { transform: translateY(0); }
        .vl-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* Orange highlight on btn */
        .vl-btn-accent {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 5px;
          background: #d9732d;
          border-radius: 0 10px 10px 0;
        }

        /* Spinner */
        .vl-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: vlSpin 0.75s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }
        @keyframes vlSpin { to { transform: rotate(360deg); } }

        /* Divider */
        .vl-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0;
        }
        .vl-divider-line { flex: 1; height: 1px; background: #e8edf3; }
        .vl-divider span { font-size: 12px; color: #a3b5c3; letter-spacing: 0.8px; text-transform: uppercase; }

        /* Bottom text */
        .vl-bottom {
          text-align: center;
          font-size: 14px;
          color: #70879b;
        }
        .vl-bottom a {
          color: #d9732d;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .vl-bottom a:hover { color: #b85e1f; }

        /* Footer strip */
        .vl-card-bottom {
          background: #f2f5f8;
          border-top: 1px solid #e8edf3;
          padding: 12px 44px;
          font-size: 12px;
          color: #a3b5c3;
          text-align: center;
        }
      `}</style>

      <div className="vl-root">
        <div className="vl-card">
          <div className="vl-card-top" />

          <div className="vl-body">
            {/* Logo */}
            <div className="vl-logo">
              <div className="vl-logo-plate">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M12 8L16 10.5V15.5L12 18L8 15.5V10.5L12 8Z" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <span className="vl-logo-name">Volfram<span className="vl-logo-dot" /></span>
            </div>

            <h1 className="vl-heading">Welcome back</h1>
            <p className="vl-sub">Sign in to continue to your account</p>

            {error && (
              <div className="vl-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className={`vl-field ${focused === 'email' ? 'is-focused' : ''}`}>
                <label className="vl-label" htmlFor="email">Email address</label>
                <div className="vl-input-wrap">
                  <span className="vl-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    id="email" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`vl-field ${focused === 'password' ? 'is-focused' : ''}`}>
                <label className="vl-label" htmlFor="password">Password</label>
                <div className="vl-input-wrap">
                  <span className="vl-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="password" type="password" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                    required
                  />
                </div>
              </div>

              <div className="vl-forgot-row">
                <span>Forgot password? Contact your administrator.</span>
              </div>

              <button type="submit" className="vl-btn" disabled={isLoading}>
                <span className="vl-btn-accent" />
                {isLoading ? <span className="vl-spinner" /> : 'Sign In'}
              </button>
            </form>

            <div className="vl-divider">
              <div className="vl-divider-line" />
              <span>or</span>
              <div className="vl-divider-line" />
            </div>

            <p className="vl-bottom">
              Don't have an account?{' '}
              <Link to="/register">Create one here</Link>
            </p>
          </div>

          <div className="vl-card-bottom">
            Volfram Systems India Pvt. Ltd. — Precision Steam Engineering
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
