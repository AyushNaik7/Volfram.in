import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

const statLabels = [
  ['users', 'Users'],
  ['products', 'Product images'],
  ['events', 'Events'],
  ['enquiries', 'Enquiries'],
  ['requirements', 'Requirements'],
  ['chatbotLeads', 'Chatbot leads']
];

function DashboardOverview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardAPI.getSummary()
      .then(setData)
      .catch(error => setError(error.response?.data?.message || 'Unable to load dashboard data.'));
  }, []);

  if (error) return <div style={styles.message}>{error}</div>;
  if (!data) return <div style={styles.message}>Loading dashboard...</div>;

  return (
    <section style={styles.container}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>ADMIN / OVERVIEW</p>
          <h2 style={styles.title}>Dashboard Overview</h2>
        </div>
      </header>

      <div style={styles.stats}>
        {statLabels.map(([key, label]) => (
          <article key={key} style={styles.statCard}>
            <span style={styles.statLabel}>{label}</span>
            <strong style={styles.statValue}>{data.stats[key]}</strong>
          </article>
        ))}
      </div>

      <div style={styles.columns}>
        <RecentList title="Recent users" items={data.recent.users} renderItem={item => `${item.name} · ${item.email}`} />
        <RecentList title="Recent events" items={data.recent.events} renderItem={item => `${item.title} · ${item.location}`} />
        <RecentList title="Recent enquiries" items={data.recent.enquiries} renderItem={item => `${item.fullname} · ${item.subject}`} />
      </div>
    </section>
  );
}

function RecentList({ title, items, renderItem }) {
  return (
    <article style={styles.listCard}>
      <h3 style={styles.listTitle}>{title}</h3>
      {items.length === 0 ? <p style={styles.empty}>No records yet.</p> : items.map(item => (
        <p key={item._id} style={styles.listItem}>{renderItem(item)}</p>
      ))}
    </article>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', fontFamily: "'Barlow', sans-serif" },
  header: { marginBottom: '24px' },
  eyebrow: { margin: '0 0 6px', color: '#d9732d', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px' },
  title: { margin: 0, color: '#0f2d4d', font: "700 26px 'Sora', sans-serif" },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' },
  statCard: { background: '#fff', border: '1px solid #d5dee7', borderRadius: '10px', padding: '18px' },
  statLabel: { display: 'block', color: '#70879b', fontSize: '13px', marginBottom: '10px' },
  statValue: { color: '#0f2d4d', font: "700 30px 'Sora', sans-serif" },
  columns: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  listCard: { background: '#fff', border: '1px solid #d5dee7', borderRadius: '10px', padding: '18px' },
  listTitle: { margin: '0 0 12px', color: '#0f2d4d', font: "700 16px 'Sora', sans-serif" },
  listItem: { margin: 0, padding: '10px 0', borderTop: '1px solid #edf1f4', color: '#455b70', fontSize: '13px' },
  empty: { color: '#70879b', fontSize: '13px' },
  message: { padding: '50px', textAlign: 'center', color: '#455b70', fontFamily: "'Barlow', sans-serif" }
};

export default DashboardOverview;