import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [focused, setFocused]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [step, setStep]         = useState(1); // 1 = form, 2 = success

  const handleChange = field => e =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:7000';
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          number: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Registration failed. Please try again.');
      } else {
        setStep(2);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = formData.password;
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
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');

        .vr-root {
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
        .vr-root *, .vr-root *::before, .vr-root *::after { box-sizing: border-box; }

        .vr-card {
          width: 100%;
          max-width: 540px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 48px rgba(15,45,77,0.12), 0 2px 12px rgba(15,45,77,0.06);
          border: 1px solid #d5dee7;
          overflow: hidden;
        }

        .vr-card-top {
          height: 5px;
          background: linear-gradient(90deg, #0f2d4d 0%, #146c8a 50%, #d9732d 100%);
        }

        .vr-body { padding: 44px 44px 36px; }

        /* Logo */
        .vr-logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 28px; }
        .vr-logo-plate {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #0f2d4d, #146c8a);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(15,45,77,0.25);
        }
        .vr-logo-name { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 22px; color: #0f2d4d; letter-spacing: -0.3px; }
        .vr-logo-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #d9732d; margin-left: 2px; vertical-align: super; }

        .vr-heading { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 800; color: #0f2d4d; margin: 0 0 4px 0; line-height: 1.15; }
        .vr-sub { font-size: 14px; color: #70879b; margin: 0 0 28px 0; }

        /* Two-col row */
        .vr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 480px) { .vr-row { grid-template-columns: 1fr; } }

        /* Field */
        .vr-field { margin-bottom: 18px; }
        .vr-field.full { margin-bottom: 18px; }

        .vr-label {
          display: block; font-size: 11px; font-weight: 600;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: #455b70; margin-bottom: 7px; transition: color 0.2s;
        }
        .vr-field.is-focused .vr-label { color: #146c8a; }

        .vr-input-wrap { position: relative; }

        .vr-input-wrap input,
        .vr-input-wrap select {
          width: 100%;
          padding: 12px 14px 12px 44px;
          border: 1.5px solid #d5dee7;
          border-radius: 10px;
          font-family: 'Barlow', sans-serif;
          font-size: 14px;
          color: #0f2d4d;
          outline: none;
          transition: all 0.2s;
          background: #fff;
          appearance: none;
        }
        .vr-input-wrap input::placeholder { color: #a3b5c3; }
        .vr-input-wrap input:focus,
        .vr-input-wrap select:focus {
          border-color: #146c8a;
          box-shadow: 0 0 0 3px rgba(20,108,138,0.1);
        }
        .vr-field.is-focused .vr-input-wrap input,
        .vr-field.is-focused .vr-input-wrap select {
          border-color: #146c8a;
          box-shadow: 0 0 0 3px rgba(20,108,138,0.1);
        }

        .vr-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: #a3b5c3; pointer-events: none; transition: color 0.2s;
        }
        .vr-field.is-focused .vr-icon { color: #146c8a; }

        /* Role select caret */
        .vr-select-caret {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none; color: #a3b5c3;
        }

        /* Password strength */
        .vr-strength-bars { display: flex; gap: 4px; margin-top: 8px; }
        .vr-strength-seg { flex: 1; height: 3px; border-radius: 2px; background: #e8edf3; transition: background 0.3s; }
        .vr-strength-label { font-size: 11px; margin-top: 4px; font-weight: 600; }

        /* Password mismatch */
        .vr-mismatch { font-size: 11px; color: #ef4444; margin-top: 5px; }

        /* Checkbox */
        .vr-agree {
          display: flex; align-items: flex-start; gap: 10px;
          margin-bottom: 22px;
        }
        .vr-agree input[type="checkbox"] {
          appearance: none; width: 17px; height: 17px; min-width: 17px;
          border: 1.5px solid #d5dee7; border-radius: 5px;
          background: #fff; cursor: pointer; margin-top: 2px;
          transition: all 0.2s; position: relative;
        }
        .vr-agree input[type="checkbox"]:checked {
          background: linear-gradient(135deg, #0f2d4d, #146c8a);
          border-color: transparent;
        }
        .vr-agree input[type="checkbox"]:checked::after {
          content: ''; position: absolute;
          left: 4px; top: 1px; width: 5px; height: 9px;
          border: 2px solid #fff; border-top: none; border-left: none;
          transform: rotate(45deg);
        }
        .vr-agree span { font-size: 13px; color: #70879b; line-height: 1.5; }
        .vr-agree span a { color: #d9732d; text-decoration: none; font-weight: 600; }
        .vr-agree span a:hover { color: #b85e1f; }

        /* Submit */
        .vr-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0f2d4d 0%, #146c8a 100%);
          border: none; border-radius: 10px;
          font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700;
          color: #fff; cursor: pointer; position: relative; overflow: hidden;
          transition: all 0.25s;
          box-shadow: 0 6px 24px rgba(15,45,77,0.28);
          letter-spacing: 0.3px;
        }
        .vr-btn::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0); transition: background 0.2s; }
        .vr-btn:hover::after { background: rgba(255,255,255,0.08); }
        .vr-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 32px rgba(15,45,77,0.34); }
        .vr-btn:active { transform: translateY(0); }
        .vr-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .vr-btn-accent { position: absolute; right: 0; top: 0; bottom: 0; width: 5px; background: #d9732d; border-radius: 0 10px 10px 0; }

        .vr-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: vrSpin 0.75s linear infinite; display: inline-block; vertical-align: middle; }
        @keyframes vrSpin { to { transform: rotate(360deg); } }

        /* Divider */
        .vr-divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; }
        .vr-divider-line { flex: 1; height: 1px; background: #e8edf3; }
        .vr-divider span { font-size: 12px; color: #a3b5c3; letter-spacing: 0.8px; text-transform: uppercase; }

        .vr-bottom { text-align: center; font-size: 14px; color: #70879b; }
        .vr-bottom a { color: #d9732d; font-weight: 600; text-decoration: none; transition: color 0.2s; }
        .vr-bottom a:hover { color: #b85e1f; }

        /* Success */
        .vr-success { text-align: center; padding: 20px 0; }
        .vr-success-icon {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #0f2d4d, #146c8a);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 32px rgba(15,45,77,0.25);
        }
        .vr-success h2 { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 800; color: #0f2d4d; margin-bottom: 10px; }
        .vr-success p { font-size: 14px; color: #70879b; line-height: 1.6; margin-bottom: 28px; }
        .vr-success-btn {
          display: inline-block; padding: 13px 36px;
          background: linear-gradient(135deg, #0f2d4d, #146c8a);
          border-radius: 10px; color: #fff;
          font-family: 'Sora', sans-serif; font-weight: 700; font-size: 14px;
          text-decoration: none;
          box-shadow: 0 6px 24px rgba(15,45,77,0.28);
          transition: all 0.25s;
          position: relative; overflow: hidden;
        }
        .vr-success-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 32px rgba(15,45,77,0.34); }
        .vr-success-accent { position: absolute; right: 0; top: 0; bottom: 0; width: 5px; background: #d9732d; border-radius: 0 10px 10px 0; }

        .vr-card-bottom {
          background: #f2f5f8; border-top: 1px solid #e8edf3;
          padding: 12px 44px; font-size: 12px; color: #a3b5c3; text-align: center;
        }

        /* Role badge hint */
        .vr-role-hint {
          font-size: 11px; color: #d9732d; margin-top: 5px; font-weight: 500;
        }
      `}</style>

      <div className="vr-root">
        <div className="vr-card">
          <div className="vr-card-top" />

          <div className="vr-body">
            {/* Logo */}
            <div className="vr-logo">
              <div className="vr-logo-plate">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.8"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="vr-logo-name">Volfram<span className="vr-logo-dot" /></span>
            </div>

            {step === 2 ? (
              /* ── Success screen ── */
              <div className="vr-success">
                <div className="vr-success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2>Account created!</h2>
                <p>
                  Check your email to verify your address,<br />
                  then sign in to get started.
                </p>
                <Link to="/login" className="vr-success-btn">
                  <span className="vr-success-accent" />
                  Go to Login →
                </Link>
              </div>
            ) : (
              /* ── Registration form ── */
              <>
                <h1 className="vr-heading">Create account</h1>
                <p className="vr-sub">Join Volfram Systems — it's free</p>

                <form onSubmit={handleSubmit}>
                  {/* Name + Phone */}
                  <div className="vr-row">
                    <div className={`vr-field ${focused === 'fullName' ? 'is-focused' : ''}`}>
                      <label className="vr-label">Full Name *</label>
                      <div className="vr-input-wrap">
                        <span className="vr-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                          </svg>
                        </span>
                        <input
                          type="text" placeholder="John Doe"
                          value={formData.fullName} onChange={handleChange('fullName')}
                          onFocus={() => setFocused('fullName')} onBlur={() => setFocused('')}
                          required
                        />
                      </div>
                    </div>

                    <div className={`vr-field ${focused === 'phone' ? 'is-focused' : ''}`}>
                      <label className="vr-label">Phone</label>
                      <div className="vr-input-wrap">
                        <span className="vr-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                        </span>
                        <input
                          type="tel" placeholder="+91 00000 00000"
                          value={formData.phone} onChange={handleChange('phone')}
                          onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className={`vr-field full ${focused === 'email' ? 'is-focused' : ''}`}>
                    <label className="vr-label">Email Address *</label>
                    <div className="vr-input-wrap">
                      <span className="vr-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </span>
                      <input
                        type="email" placeholder="you@example.com"
                        value={formData.email} onChange={handleChange('email')}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                        required
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div className={`vr-field full ${focused === 'role' ? 'is-focused' : ''}`}>
                    <label className="vr-label">Account Role</label>
                    <div className="vr-input-wrap">
                      <span className="vr-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </span>
                      <select
                        value={formData.role} onChange={handleChange('role')}
                        onFocus={() => setFocused('role')} onBlur={() => setFocused('')}
                      >
                        <option value="user">User — Standard access</option>
                        <option value="admin">Admin — Full dashboard access</option>
                      </select>
                      <span className="vr-select-caret">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </span>
                    </div>
                    {formData.role === 'admin' && (
                      <p className="vr-role-hint">⚠ Admin accounts have full access to the dashboard.</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className={`vr-field full ${focused === 'password' ? 'is-focused' : ''}`}>
                    <label className="vr-label">Password *</label>
                    <div className="vr-input-wrap">
                      <span className="vr-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </span>
                      <input
                        type="password" placeholder="Min. 8 characters"
                        value={formData.password} onChange={handleChange('password')}
                        onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                        required
                      />
                    </div>
                    {formData.password && (
                      <>
                        <div className="vr-strength-bars">
                          {[1,2,3,4].map(i => (
                            <div
                              key={i}
                              className="vr-strength-seg"
                              style={{ background: i <= strength ? strengthColor[strength] : '#e8edf3' }}
                            />
                          ))}
                        </div>
                        <div className="vr-strength-label" style={{ color: strengthColor[strength] }}>
                          {strengthLabel[strength]}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className={`vr-field full ${focused === 'confirmPassword' ? 'is-focused' : ''}`}>
                    <label className="vr-label">Confirm Password *</label>
                    <div className="vr-input-wrap">
                      <span className="vr-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </span>
                      <input
                        type="password" placeholder="Re-enter password"
                        value={formData.confirmPassword} onChange={handleChange('confirmPassword')}
                        onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused('')}
                        required
                        style={{
                          borderColor: formData.confirmPassword && formData.confirmPassword !== formData.password
                            ? '#fca5a5' : undefined
                        }}
                      />
                    </div>
                    {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                      <p className="vr-mismatch">Passwords do not match</p>
                    )}
                  </div>

                  {/* Terms agreement */}
                  <div className="vr-agree">
                    <input
                      type="checkbox" id="terms"
                      checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    />
                    <span>
                      I agree to the{' '}
                      <a href="#terms">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#privacy">Privacy Policy</a>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="vr-btn"
                    disabled={
                      !agreed ||
                      isLoading ||
                      (formData.confirmPassword !== '' && formData.confirmPassword !== formData.password)
                    }
                  >
                    <span className="vr-btn-accent" />
                    {isLoading ? <span className="vr-spinner" /> : 'Create Account'}
                  </button>
                </form>

                <div className="vr-divider">
                  <div className="vr-divider-line" />
                  <span>or</span>
                  <div className="vr-divider-line" />
                </div>

                <p className="vr-bottom">
                  Already have an account?{' '}
                  <Link to="/login">Sign in here</Link>
                </p>
              </>
            )}
          </div>

          <div className="vr-card-bottom">
            Volfram Systems India Pvt. Ltd. — Precision Steam Engineering
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
