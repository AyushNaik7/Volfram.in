import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, requirementsAPI, authAPI } from '../services/api';

function UserDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('submit');
  const [requirements, setRequirements] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium' });
  const [state, setState] = useState({ loading: true, submitting: false, message: '', error: '' });

  useEffect(() => {
    if (!getAccessToken()) { navigate('/login'); return; }
    requirementsAPI.getMine()
      .then((data) => setRequirements(data.requirements || []))
      .catch((error) => setState((current) => ({ ...current, error: error.response?.data?.message || 'Unable to load your requirements.' })))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState((current) => ({ ...current, submitting: true, message: '', error: '' }));
    try {
      const data = await requirementsAPI.create(form);
      setRequirements((current) => [data.requirement, ...current]);
      setForm({ title: '', description: '', category: '', priority: 'Medium' });
      setState((current) => ({ ...current, message: 'Requirement submitted successfully.' }));
    } catch (error) {
      setState((current) => ({ ...current, error: error.response?.data?.message || 'Unable to submit requirement.' }));
    } finally { setState((current) => ({ ...current, submitting: false })); }
  };

  const logout = async () => { await authAPI.logout(); navigate('/login'); };
  const pendingCount = requirements.filter((item) => item.status === 'Pending').length;
  const completedCount = requirements.filter((item) => item.status === 'Completed').length;
  if (state.loading) return <div className="user-dashboard__loading">Loading your workspace...</div>;
  return <main className="user-dashboard">
    <header className="user-dashboard__hero">
      <div><p className="user-dashboard__eyebrow">VOLFRAM SYSTEMS / CLIENT PORTAL</p><h1>Good to see you.</h1><p className="user-dashboard__intro">Keep your engineering requirements moving from first note to finished solution.</p></div>
      <button className="user-dashboard__logout" onClick={logout}>Log out <span aria-hidden="true">↗</span></button>
    </header>
    <section className="user-dashboard__stats" aria-label="Requirement summary"><div><span>Total requests</span><strong>{requirements.length}</strong></div><div><span>Awaiting review</span><strong>{pendingCount}</strong></div><div><span>Completed</span><strong>{completedCount}</strong></div></section>
    <nav className="user-dashboard__tabs" aria-label="Dashboard views"><button className={tab === 'submit' ? 'is-active' : ''} onClick={() => setTab('submit')}>New requirement <span>+</span></button><button className={tab === 'mine' ? 'is-active' : ''} onClick={() => setTab('mine')}>Request history <span>{requirements.length}</span></button></nav>
    {state.error && <div className="user-dashboard__alert user-dashboard__alert--error">{state.error}</div>}{state.message && <div className="user-dashboard__alert user-dashboard__alert--success">{state.message}</div>}
    {tab === 'submit' ? <form className="requirement-form" onSubmit={handleSubmit}><div className="requirement-form__heading"><span className="requirement-form__number">01</span><div><p className="user-dashboard__eyebrow">START A CONVERSATION</p><h2>What can we help you solve?</h2><p>Share the details and our team will review your request.</p></div></div><label>Requirement title<input required maxLength="160" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Steam system consultation" /></label><label>Description<textarea required maxLength="5000" rows="7" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe your requirement, equipment, specifications, or project context..." /></label><div className="requirement-form__fields"><label>Category <span>Optional</span><input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="General" /></label><label>Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label></div><button className="requirement-form__submit" disabled={state.submitting}>{state.submitting ? 'Sending request...' : 'Send requirement'} <span aria-hidden="true">→</span></button></form> : <section className="request-history"><div className="request-history__heading"><div><p className="user-dashboard__eyebrow">YOUR ACTIVITY</p><h2>Request history</h2></div><span>{requirements.length} {requirements.length === 1 ? 'request' : 'requests'}</span></div>{requirements.length === 0 ? <div className="user-dashboard__empty"><span>○</span><h3>Your request history is empty</h3><p>Submit your first requirement and it will appear here.</p><button onClick={() => setTab('submit')}>Create a request →</button></div> : <div className="request-history__list">{requirements.map((item) => <article className="request-card" key={item._id}><div className="request-card__top"><span className="request-card__category">{item.category || 'General'}</span><span className={`request-card__status request-card__status--${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></div><h3>{item.title}</h3><p>{item.description}</p><footer><span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span><span>{item.priority} priority</span></footer></article>)}</div>}</section>}
  </main>;
}

export default UserDashboard;