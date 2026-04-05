import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [focused, setFocused] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState(1); // 1 = form, 2 = success

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1800);
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
  const strength = passwordStrength();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .reg-root {
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          padding: 80px 20px;
          box-sizing: border-box;
        }

        .reg-root *, .reg-root *::before, .reg-root *::after {
          box-sizing: border-box;
        }

        /* Background grid */
        .reg-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: regGridShift 20s linear infinite;
          pointer-events: none;
        }

        @keyframes regGridShift {
          0%   { transform: perspective(800px) rotateX(10deg) translateY(0); }
          100% { transform: perspective(800px) rotateX(10deg) translateY(60px); }
        }

        /* Orbs */
        .reg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.12;
          animation: regOrbFloat 9s ease-in-out infinite;
          pointer-events: none;
        }
        .reg-orb-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #06b6d4, transparent);
          top: -180px; right: -120px;
          animation-delay: 0s;
        }
        .reg-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #6366f1, transparent);
          bottom: -120px; left: -100px;
          animation-delay: -4.5s;
        }
        .reg-orb-3 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, #a855f7, transparent);
          top: 40%; left: 15%;
          animation-delay: -2s;
        }

        @keyframes regOrbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-28px) scale(1.04); }
        }

        /* Card */
        .reg-card {
          position: relative;
          width: 480px;
          max-width: 100%;
          padding: 48px 44px 40px;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 40px 80px rgba(0,0,0,0.55),
            0 0 80px rgba(6,182,212,0.07);
          transform: perspective(1200px) rotateX(2deg);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          animation: regCardIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .reg-card:hover {
          transform: perspective(1200px) rotateX(0deg) translateY(-4px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.07) inset,
            0 60px 100px rgba(0,0,0,0.65),
            0 0 120px rgba(6,182,212,0.1);
        }

        @keyframes regCardIn {
          from { opacity: 0; transform: perspective(1200px) rotateX(8deg) translateY(40px); }
          to   { opacity: 1; transform: perspective(1200px) rotateX(2deg) translateY(0); }
        }

        /* Accent bar — cyan this time to differ from login */
        .reg-accent-bar {
          position: absolute;
          top: 0; left: 44px; right: 44px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(6,182,212,0.8), rgba(168,85,247,0.8), transparent);
          border-radius: 0 0 4px 4px;
        }

        /* Reflection */
        .reg-card::after {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 55%;
          background: linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%);
          border-radius: 24px 24px 0 0;
          pointer-events: none;
        }

        /* Logo */
        .reg-logo {
          width: 50px; height: 50px;
          background: linear-gradient(135deg, #06b6d4, #a855f7);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(6,182,212,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset;
          transform: rotate(4deg);
          animation: regLogoFloat 4s ease-in-out infinite;
        }

        @keyframes regLogoFloat {
          0%, 100% { transform: rotate(4deg) translateY(0); }
          50%       { transform: rotate(4deg) translateY(-4px); }
        }

        /* Step progress */
        .reg-steps {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 28px;
          animation: regFadeUp 0.5s 0.1s both;
        }
        .reg-step-dot {
          height: 3px;
          border-radius: 2px;
          transition: all 0.4s ease;
        }
        .reg-step-dot.active {
          background: linear-gradient(90deg, #06b6d4, #a855f7);
          flex: 2;
        }
        .reg-step-dot.inactive {
          background: rgba(255,255,255,0.1);
          flex: 1;
        }

        /* Heading */
        .reg-heading {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
          line-height: 1.15;
          margin-bottom: 4px;
          animation: regFadeUp 0.5s 0.15s both;
        }

        .reg-sub {
          font-size: 13.5px;
          color: rgba(255,255,255,0.38);
          margin-bottom: 28px;
          animation: regFadeUp 0.5s 0.2s both;
        }

        @keyframes regFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Two-column row */
        .reg-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        /* Field */
        .reg-field {
          margin-bottom: 16px;
        }

        .reg-field label {
          display: block;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 7px;
          transition: color 0.2s;
        }

        .reg-field.is-focused label { color: rgba(6,182,212,0.9); }

        .reg-input-wrap { position: relative; }

        .reg-input-wrap input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px;
          padding: 13px 16px 13px 44px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #fff;
          outline: none;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2) inset;
        }

        .reg-input-wrap input::placeholder { color: rgba(255,255,255,0.18); }

        .reg-input-wrap input:focus {
          background: rgba(6,182,212,0.05);
          border-color: rgba(6,182,212,0.45);
          box-shadow: 0 0 0 3px rgba(6,182,212,0.1), 0 2px 8px rgba(0,0,0,0.2) inset;
        }

        .reg-input-icon {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.22);
          pointer-events: none;
          transition: color 0.25s;
        }

        .reg-field.is-focused .reg-input-icon { color: rgba(6,182,212,0.75); }

        /* Password strength */
        .strength-bar-wrap {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }
        .strength-bar-seg {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.08);
          transition: background 0.3s ease;
        }
        .strength-label {
          font-size: 11px;
          margin-top: 5px;
          transition: color 0.3s;
        }

        /* Checkbox */
        .reg-checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 22px;
          animation: regFadeUp 0.5s 0.45s both;
        }

        .reg-checkbox-wrap input[type="checkbox"] {
          appearance: none;
          width: 17px; height: 17px;
          min-width: 17px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 5px;
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          position: relative;
          margin-top: 1px;
          transition: all 0.2s;
        }

        .reg-checkbox-wrap input[type="checkbox"]:checked {
          background: linear-gradient(135deg, #06b6d4, #a855f7);
          border-color: transparent;
        }

        .reg-checkbox-wrap input[type="checkbox"]:checked::after {
          content: '';
          position: absolute;
          left: 4px; top: 1.5px;
          width: 5px; height: 9px;
          border: 2px solid #fff;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }

        .reg-checkbox-wrap span {
          font-size: 12.5px;
          color: rgba(255,255,255,0.35);
          line-height: 1.5;
        }

        .reg-checkbox-wrap span a {
          color: rgba(6,182,212,0.85);
          text-decoration: none;
        }
        .reg-checkbox-wrap span a:hover { color: #67e8f9; }

        /* Submit */
        .reg-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #06b6d4 0%, #6366f1 60%, #a855f7 100%);
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.4px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(6,182,212,0.3), 0 0 0 1px rgba(255,255,255,0.08) inset;
          animation: regFadeUp 0.5s 0.5s both;
        }

        .reg-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .reg-btn:hover::before { opacity: 1; }
        .reg-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(6,182,212,0.4), 0 0 0 1px rgba(255,255,255,0.12) inset;
        }
        .reg-btn:active { transform: translateY(0); }
        .reg-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .reg-btn.loading { pointer-events: none; }

        /* Spinner */
        .reg-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: regSpin 0.8s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }

        @keyframes regSpin { to { transform: rotate(360deg); } }

        /* Divider */
        .reg-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0;
          animation: regFadeUp 0.5s 0.55s both;
        }
        .reg-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .reg-divider span {
          font-size: 11px;
          color: rgba(255,255,255,0.18);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* Login link */
        .reg-login-text {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.28);
          animation: regFadeUp 0.5s 0.6s both;
        }
        .reg-login-text a {
          color: rgba(6,182,212,0.85);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .reg-login-text a:hover { color: #67e8f9; }

        /* Success state */
        .reg-success {
          text-align: center;
          padding: 20px 0;
          animation: regFadeUp 0.6s both;
        }

        .reg-success-icon {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #06b6d4, #a855f7);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 40px rgba(6,182,212,0.4);
          animation: regSuccessPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes regSuccessPop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .reg-success h2 {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 10px;
        }

        .reg-success p {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          margin-bottom: 28px;
        }
      `}</style>

      <div className="reg-root">
        <div className="reg-bg-grid" />
        <div className="reg-orb reg-orb-1" />
        <div className="reg-orb reg-orb-2" />
        <div className="reg-orb reg-orb-3" />

        <div className="reg-card">
          <div className="reg-accent-bar" />

          {step === 2 ? (
            /* ── Success Screen ── */
            <div className="reg-success">
              <div className="reg-success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2>You're all set!</h2>
              <p>Your account has been created successfully.<br />You can now sign in to get started.</p>
              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  padding: '13px 36px',
                  background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(6,182,212,0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                Go to Login →
              </Link>
            </div>
          ) : (
            /* ── Registration Form ── */
            <>
              {/* Logo */}
              <div className="reg-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.8"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Progress dots */}
              <div className="reg-steps">
                <div className="reg-step-dot active" />
                <div className="reg-step-dot inactive" />
              </div>

              <h1 className="reg-heading">Create account</h1>
              <p className="reg-sub">Join Volfram Systems — it's free</p>

              {/* Name + Phone row */}
              <div className="reg-row">
                <div className={`reg-field ${focused === 'fullName' ? 'is-focused' : ''}`}>
                  <label>Full Name</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={handleChange('fullName')}
                      onFocus={() => setFocused('fullName')}
                      onBlur={() => setFocused('')}
                      required
                    />
                  </div>
                </div>

                <div className={`reg-field ${focused === 'phone' ? 'is-focused' : ''}`}>
                  <label>Phone</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused('')}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className={`reg-field ${focused === 'email' ? 'is-focused' : ''}`}>
                <label>Email Address</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`reg-field ${focused === 'password' ? 'is-focused' : ''}`}>
                <label>Password</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange('password')}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    required
                  />
                </div>
                {/* Strength meter */}
                {form.password && (
                  <>
                    <div className="strength-bar-wrap">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className="strength-bar-seg"
                          style={{ background: i <= strength ? strengthColor[strength] : 'rgba(255,255,255,0.08)' }}
                        />
                      ))}
                    </div>
                    <div className="strength-label" style={{ color: strengthColor[strength] }}>
                      {strengthLabel[strength]}
                    </div>
                  </>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`reg-field ${focused === 'confirmPassword' ? 'is-focused' : ''}`}>
                <label>Confirm Password</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    onFocus={() => setFocused('confirmPassword')}
                    onBlur={() => setFocused('')}
                    required
                    style={{
                      borderColor: form.confirmPassword && form.confirmPassword !== form.password
                        ? 'rgba(239,68,68,0.5)' : undefined
                    }}
                  />
                </div>
                {form.confirmPassword && form.confirmPassword !== form.password && (
                  <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '5px' }}>
                    Passwords do not match
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="reg-checkbox-wrap">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  I agree to the{' '}
                  <a href="/terms">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy">Privacy Policy</a>
                </span>
              </div>

              {/* Submit */}
              <button
                className={`reg-btn ${isLoading ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={!agreed || (form.confirmPassword && form.confirmPassword !== form.password)}
              >
                {isLoading ? <span className="reg-spinner" /> : 'Create Account'}
              </button>

              <div className="reg-divider">
                <div className="reg-divider-line" />
                <span>or</span>
                <div className="reg-divider-line" />
              </div>

              <p className="reg-login-text">
                Already have an account?{' '}
                <Link to="/login">Sign in here</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Register;