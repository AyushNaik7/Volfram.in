import { useState, useEffect } from 'react';
import { pagesAPI } from '../../services/api';
import PageForm from './PageForm';

/**
 * Pages List Component
 * Displays all pages in card layout with edit/delete actions
 */
function PagesList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  // Fetch pages on component mount
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await pagesAPI.getAll();
      setPages(response.pages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      alert('Failed to load pages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingPage(null);
    setShowForm(true);
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setShowForm(true);
  };

  const handleDelete = async (pageId) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      await pagesAPI.delete(pageId);
      alert('Page deleted successfully!');
      fetchPages(); // Refresh list
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page. Please try again.');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPage(null);
    fetchPages(); // Refresh list after form closes
  };

  if (loading) {
    return <div style={styles.loading}>Loading pages...</div>;
  }

  if (showForm) {
    return (
      <PageForm
        page={editingPage}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Pages Management</h2>
        <button style={styles.addBtn} onClick={handleAddNew}>
          + Add New Page
        </button>
      </div>

      {pages.length === 0 ? (
        <div style={styles.empty}>
          <p>No pages found. Create your first page!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {pages.map((page) => (
            <div key={page._id} style={styles.card}>
              {page.imageUrl && (
                <div style={styles.imageContainer}>
                  <img
                    src={`http://localhost:7000${page.imageUrl}`}
                    alt={page.title}
                    style={styles.image}
                  />
                </div>
              )}
              
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{page.title}</h3>
                
                {page.category && (
                  <span style={styles.category}>{page.category}</span>
                )}
                
                {page.description && (
                  <p style={styles.description}>{page.description}</p>
                )}
                
                <div style={styles.cardFooter}>
                  <span style={styles.date}>
                    {new Date(page.createdAt).toLocaleDateString()}
                  </span>
                  
                  <div style={styles.actions}>
                    <button
                      style={styles.editBtn}
                      onClick={() => handleEdit(page)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(page._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Barlow', sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px'
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f2d4d',
    margin: 0,
    fontFamily: "'Sora', sans-serif"
  },
  addBtn: {
    padding: '11px 22px',
    background: 'linear-gradient(135deg, #d9732d, #b85e1f)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(217,115,45,0.3)',
    fontFamily: "'Barlow', sans-serif"
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '16px',
    color: '#455b70',
    fontFamily: "'Barlow', sans-serif"
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    background: '#fff',
    borderRadius: '12px',
    color: '#455b70',
    border: '1px solid #d5dee7'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(15,45,77,0.08)',
    transition: 'all 0.2s',
    border: '1px solid #d5dee7'
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    background: '#f2f5f8'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '20px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f2d4d',
    margin: '0 0 10px 0',
    fontFamily: "'Sora', sans-serif"
  },
  category: {
    display: 'inline-block',
    padding: '3px 10px',
    background: 'rgba(20,108,138,0.1)',
    color: '#146c8a',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '10px'
  },
  description: {
    fontSize: '14px',
    color: '#455b70',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '14px',
    borderTop: '1px solid #f2f5f8'
  },
  date: {
    fontSize: '12px',
    color: '#70879b'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    padding: '6px 14px',
    background: '#146c8a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Barlow', sans-serif"
  },
  deleteBtn: {
    padding: '6px 14px',
    background: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Barlow', sans-serif"
  }
};

export default PagesList;
