import { useState } from 'react';
import { authAPI, clearAccessToken } from '../../services/api';

/**
 * Admin Dashboard Layout Component
 * Provides sidebar navigation and header with logout
 */
function AdminLayout({ children, activeSection, onSectionChange }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authAPI.logout();
      clearAccessToken();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>V</div>
          <h2 style={styles.logoText}>Volfram Admin</h2>
        </div>

        <nav style={styles.nav}>
          <button
            style={{
              ...styles.navItem,
              ...(activeSection === 'pages' ? styles.navItemActive : {})
            }}
            onClick={() => onSectionChange('pages')}
          >
            <span style={styles.navIcon}>📄</span>
            Pages
          </button>
          
          <button
            style={{
              ...styles.navItem,
              ...(activeSection === 'images' ? styles.navItemActive : {})
            }}
            onClick={() => onSectionChange('images')}
          >
            <span style={styles.navIcon}>🖼️</span>
            Image Manager
          </button>
          
          <button
            style={{
              ...styles.navItem,
              ...(activeSection === 'dashboard' ? styles.navItemActive : {})
            }}
            onClick={() => onSectionChange('dashboard')}
          >
            <span style={styles.navIcon}>📊</span>
            Dashboard
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Admin Dashboard</h1>
          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </header>

        {/* Content Area */}
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f2f5f8',
    fontFamily: "'Barlow', sans-serif"
  },
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #0f2d4d 0%, #081f36 100%)',
    padding: '24px',
    boxShadow: '2px 0 12px rgba(15,45,77,0.18)',
    flexShrink: 0
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.12)'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #146c8a, #d9732d)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: '20px',
    fontFamily: "'Sora', sans-serif"
  },
  logoText: {
    color: '#fff',
    fontSize: '17px',
    fontWeight: '600',
    margin: 0,
    fontFamily: "'Sora', sans-serif"
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 14px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.65)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
    fontFamily: "'Barlow', sans-serif",
    width: '100%'
  },
  navItemActive: {
    background: 'rgba(217,115,45,0.18)',
    color: '#fff',
    borderLeft: '3px solid #d9732d'
  },
  navIcon: {
    fontSize: '17px'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  header: {
    background: '#fff',
    padding: '18px 32px',
    boxShadow: '0 2px 8px rgba(15,45,77,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #d5dee7'
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f2d4d',
    margin: 0,
    fontFamily: "'Sora', sans-serif"
  },
  logoutBtn: {
    padding: '9px 22px',
    background: 'linear-gradient(135deg, #0f2d4d, #146c8a)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Barlow', sans-serif"
  },
  content: {
    flex: 1,
    padding: '32px',
    overflow: 'auto'
  }
};

export default AdminLayout;
