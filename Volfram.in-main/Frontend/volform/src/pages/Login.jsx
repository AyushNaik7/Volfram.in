import { useState } from "react";

// Mock Link component for standalone preview
const Link = ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
        const response = await fetch('http://localhost:7000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
          if (response.ok) {  
            console.log('Login successful:', data);
          } else {
            console.error('Login failed:', data);
          }
      
    } catch (error) {
      
    }
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log('Email:', email);
      console.log('Password:', password);
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }, 1800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body, html { height: 100%; }

        .login-root {
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          padding: 80px 20px;
        }

        /* Animated background grid */
        .bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridShift 20s linear infinite;
        }

        @keyframes gridShift {
          0% { transform: perspective(800px) rotateX(10deg) translateY(0); }
          100% { transform: perspective(800px) rotateX(10deg) translateY(60px); }
        }

        /* Glowing orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #6366f1, transparent);
          top: -150px; left: -150px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #06b6d4, transparent);
          bottom: -100px; right: -100px;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #8b5cf6, transparent);
          top: 50%; left: 60%;
          animation-delay: -2s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* Card */
        .card {
          position: relative;
          width: 420px;
          padding: 52px 44px 44px;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 40px 80px rgba(0,0,0,0.6),
            0 0 80px rgba(99,102,241,0.08);
          transform: perspective(1200px) rotateX(2deg);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          animation: cardEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .card:hover {
          transform: perspective(1200px) rotateX(0deg) translateY(-4px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.08) inset,
            0 60px 100px rgba(0,0,0,0.7),
            0 0 120px rgba(99,102,241,0.12);
        }

        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: perspective(1200px) rotateX(8deg) translateY(40px);
          }
          to {
            opacity: 1;
            transform: perspective(1200px) rotateX(2deg) translateY(0);
          }
        }

        /* Top accent bar */
        .accent-bar {
          position: absolute;
          top: 0; left: 44px; right: 44px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(6,182,212,0.8), transparent);
          border-radius: 0 0 4px 4px;
        }

        /* Logo mark */
        .logo-mark {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
          box-shadow: 0 8px 32px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset;
          transform: rotate(-4deg);
          animation: logoFloat 4s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% { transform: rotate(-4deg) translateY(0); }
          50% { transform: rotate(-4deg) translateY(-4px); }
        }

        .logo-mark svg { width: 26px; height: 26px; }

        /* Heading */
        .heading {
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          line-height: 1.1;
          margin-bottom: 6px;
          animation: fadeUp 0.6s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .subheading {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
          margin-bottom: 36px;
          animation: fadeUp 0.6s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Input group */
        .field {
          margin-bottom: 18px;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .field:nth-child(1) { animation-delay: 0.35s; }
        .field:nth-child(2) { animation-delay: 0.42s; }

        .field label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .field.is-focused label {
          color: rgba(99,102,241,0.9);
        }

        .input-wrap {
          position: relative;
        }

        .input-wrap input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 18px 14px 46px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #fff;
          outline: none;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2) inset;
        }

        .input-wrap input::placeholder { color: rgba(255,255,255,0.2); }

        .input-wrap input:focus {
          background: rgba(99,102,241,0.06);
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.2) inset;
        }

        .input-icon {
          position: absolute;
          left: 16px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          pointer-events: none;
          transition: color 0.25s;
        }

        .field.is-focused .input-icon { color: rgba(99,102,241,0.8); }

        /* Forgot */
        .forgot {
          text-align: right;
          margin-top: -8px;
          margin-bottom: 28px;
          animation: fadeUp 0.6s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .forgot a {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }
        .forgot a:hover { color: rgba(99,102,241,0.9); }

        /* Submit button */
        .btn-submit {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #06b6d4 100%);
          background-size: 200% 200%;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset;
          animation: fadeUp 0.6s 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .btn-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .btn-submit:hover::before { opacity: 1; }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(99,102,241,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset;
        }

        .btn-submit:active { transform: translateY(0); }

        .btn-submit.loading {
          pointer-events: none;
          background: linear-gradient(135deg, #4f46e5, #4338ca);
        }

        /* Spinner */
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0;
          animation: fadeUp 0.6s 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .divider-line {
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .divider span {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* Register link */
        .register-text {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          animation: fadeUp 0.6s 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .register-text a {
          color: rgba(99,102,241,0.9);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .register-text a:hover { color: #818cf8; }

        /* 3D reflection strip */
        .card::after {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 60%;
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
          border-radius: 24px 24px 0 0;
          pointer-events: none;
        }
      `}</style>

      <div className="login-root">
        <div className="bg-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="card">
          <div className="accent-bar" />

          {/* Logo */}
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 8L16 10.5V15.5L12 18L8 15.5V10.5L12 8Z" fill="white" opacity="0.6"/>
            </svg>
          </div>

          <h1 className="heading">Welcome back</h1>
          <p className="subheading">Sign in to continue your session</p>

          <div onSubmit={handleSubmit}>
            {/* Email */}
            <div className={`field ${focused === 'email' ? 'is-focused' : ''}`}>
              <label htmlFor="email">Email address</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className={`field ${focused === 'password' ? 'is-focused' : ''}`}>
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  required
                />
              </div>
            </div>

            <div className="forgot">
              <Link to="/forgot">Forgot password?</Link>
            </div>

            <button
              className={`btn-submit ${isLoading ? 'loading' : ''}`}
              onClick={handleSubmit}
            >
              {isLoading
                ? <span className="spinner" />
                : 'Sign In'
              }
            </button>
          </div>

          <div className="divider">
            <div className="divider-line" />
            <span>or</span>
            <div className="divider-line" />
          </div>

          <p className="register-text">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;