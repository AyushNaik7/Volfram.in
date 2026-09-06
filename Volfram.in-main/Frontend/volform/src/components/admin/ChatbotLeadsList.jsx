import { useEffect, useState } from 'react';
import { chatbotLeadsAPI } from '../../services/api';

function ChatbotLeadsList() {
  const [leads, setLeads] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    chatbotLeadsAPI.getAll()
      .then((data) => setLeads(data.leads || []))
      .catch((error) => setState({ loading: false, error: error.response?.data?.message || 'Unable to load chatbot enquiries.' }))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, []);

  if (state.loading) return <div className="admin-empty-state">Loading chatbot enquiries...</div>;
  if (state.error) return <div className="admin-empty-state admin-empty-state--error">{state.error}</div>;

  return <section className="requirements-page"><header className="admin-data-header"><div><p className="admin-data-header__eyebrow">CHATBOT / QUOTATION REQUESTS</p><h2>Chatbot enquiries</h2><p>Customer details and quotation requirements collected by the assistant.</p></div><div className="admin-data-header__total"><strong>{leads.length}</strong><span>Total conversations</span></div></header><div className="admin-data-summary"><div><span>Quotation requests</span><strong>{leads.filter((lead) => lead.quoteSubmitted).length}</strong></div><div><span>With contact details</span><strong>{leads.filter((lead) => lead.customerEmail || lead.customerPhone).length}</strong></div><div><span>Latest activity</span><strong>{leads[0] ? new Date(leads[0].updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</strong></div></div>{leads.length === 0 ? <div className="admin-empty-state"><span>⌁</span><h3>No chatbot enquiries yet</h3><p>Completed chatbot conversations will appear here.</p></div> : <div className="chatbot-leads-list">{leads.map((lead, index) => <article className="chatbot-lead-card" key={lead._id}><div className="chatbot-lead-card__top"><span>#{String(index + 1).padStart(2, '0')}</span><time>{new Date(lead.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time>{lead.quoteSubmitted && <b>Quotation requested</b>}</div><div className="chatbot-lead-card__grid"><div><p className="chatbot-lead-card__label">Customer</p><h3>{lead.customerName || 'Name not provided'}</h3><p>{lead.customerEmail || 'Email not provided'}</p><p>{lead.customerPhone || 'Mobile not provided'}</p></div><div><p className="chatbot-lead-card__label">Quotation details</p>{Object.entries(lead.quoteDetails || {}).filter(([key]) => !['customerName', 'customerEmail', 'customerPhone'].includes(key)).slice(0, 8).map(([key, value]) => <p className="chatbot-lead-card__detail" key={key}><strong>{key.replace(/[A-Z]/g, letter => ` ${letter}`).replace(/^./, letter => letter.toUpperCase())}:</strong> {String(value)}</p>)}</div></div><details><summary>View conversation ({lead.messages?.length || 0} messages)</summary><div className="chatbot-lead-card__messages">{(lead.messages || []).map((message, messageIndex) => <p key={`${lead._id}-${messageIndex}`}><strong>{message.role === 'user' ? 'Customer' : 'Assistant'}:</strong> {message.content}</p>)}</div></details></article>)}</div>}</section>;
}

export default ChatbotLeadsList;