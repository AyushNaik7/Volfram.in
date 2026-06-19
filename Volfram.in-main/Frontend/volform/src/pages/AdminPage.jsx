import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import PagesList from '../components/admin/PagesList';
import ImageManager from '../components/admin/ImageManager';
import { getAccessToken } from '../services/api';

/**
 * Admin Dashboard Page
 * Main admin interface after login
 */
function AdminPage() {
  const [activeSection, setActiveSection] = useState('pages');
  const navigate = useNavigate();

  // Redirect to login if no access token
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case 'pages':
        return <PagesList />;
      case 'images':
        return <ImageManager />;
      case 'dashboard':
        return (
          <div style={styles.placeholder}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", color: '#0f2d4d', marginBottom: '8px' }}>
              Dashboard Overview
            </h2>
            <p style={{ color: '#455b70', fontFamily: "'Barlow', sans-serif" }}>
              Statistics and analytics will be shown here.
            </p>
          </div>
        );
      default:
        return <PagesList />;
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </AdminLayout>
  );
}

const styles = {
  placeholder: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #d5dee7'
  }
};

export default AdminPage;
