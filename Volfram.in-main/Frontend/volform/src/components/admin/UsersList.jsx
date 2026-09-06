import { useEffect, useState } from 'react';
import { usersAPI } from '../../services/api';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    usersAPI.getAll()
      .then((data) => setUsers(data.users || []))
      .catch((error) => setState({ loading: false, error: error.response?.data?.message || 'Unable to load users.' }))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, []);

  if (state.loading) return <div className="candidate-page__empty">Loading registered candidates...</div>;
  if (state.error) return <div className="candidate-page__empty candidate-page__empty--error">{state.error}</div>;

  const verifiedCount = users.filter((user) => user.isVerified).length;
  return <section className="candidate-page">
    <header className="candidate-page__header"><div><p className="candidate-page__eyebrow">PEOPLE / ACCESS</p><h2>Registered candidates</h2><p>Review every account registered through the Volfram portal.</p></div><div className="candidate-page__total"><strong>{users.length}</strong><span>Total accounts</span></div></header>
    <div className="candidate-page__summary"><div><span>Verified accounts</span><strong>{verifiedCount}</strong></div><div><span>Awaiting verification</span><strong>{users.length - verifiedCount}</strong></div><div><span>Admin access</span><strong>{users.filter((user) => user.role === 'admin').length}</strong></div></div>
    {users.length === 0 ? <div className="candidate-page__empty"><span>◎</span><h3>No registered candidates</h3><p>New accounts will appear here after registration.</p></div> : <div className="candidate-table-wrap">
      <table className="candidate-table"><thead><tr><th>#</th><th>Candidate</th><th>Contact</th><th>Access</th><th>Joined</th></tr></thead>
        <tbody>{users.map((user, index) => <tr key={user._id}><td className="candidate-table__index">{String(index + 1).padStart(2, '0')}</td><td><div className="candidate-table__person"><span className="candidate-table__avatar">{user.name?.charAt(0).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.isVerified ? 'Verified account' : 'Verification pending'}</small></div></div></td><td><strong className="candidate-table__email">{user.email}</strong><small className="candidate-table__phone">{user.number || 'Phone not provided'}</small></td><td><span className={`candidate-table__role candidate-table__role--${user.role}`}>{user.role}</span></td><td><strong>{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong><small>{new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></td></tr>)}</tbody>
      </table>
    </div>}
  </section>;
}

export default UsersList;