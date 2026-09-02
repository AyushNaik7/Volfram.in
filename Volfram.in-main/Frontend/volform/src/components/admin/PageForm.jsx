import { useState, useEffect } from 'react';
import { pagesAPI } from '../../services/api';

function PageForm({ page, onClose }) {
  const [formData, setFormData] = useState({ title: '', description: '', category: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');

  useEffect(() => {
    if (page) {
      setFormData({
        title:       page.title       || '',
        description: page.description || '',
        category:    page.category    || '',
      });
      if (page.imageUrl) {
        const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:7000';
        setPreviewUrl(`${API_URL}${page.imageUrl}`);
      }
    }
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Invalid file type. Only JPEG, PNG, and WEBP are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB limit.');
      return;
    }
    setErrorMsg('');
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Title is required.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('title',       formData.title);
      submitData.append('description', formData.description);
      submitData.append('category',    formData.category);
      if (selectedFile) submitData.append('photo', selectedFile);

      if (page) {
        await pagesAPI.update(page._id, submitData);
      } else {
        await pagesAPI.create(submitData);
      }
      // Close immediately — PagesList.handleFormClose will refresh the list
      onClose();
    } catch (error) {
      console.error('Error saving page:', error);
      setErrorMsg(error.response?.data?.message || 'Failed to save page. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{page ? 'Edit Page' : 'Add New Page'}</h2>
        <button style={styles.closeBtn} onClick={onClose} type="button">✕</button>
      </div>

      {errorMsg && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>⚠</span> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Title */}
        <div style={styles.field}>
          <label style={styles.label}>Page Title <span style={styles.required}>*</span></label>
          <input
            type="text" name="title"
            value={formData.title} onChange={handleInputChange}
            placeholder="Enter page title" style={styles.input} required
          />
        </div>

        {/* Category */}
        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <input
            type="text" name="category"
            value={formData.category} onChange={handleInputChange}
            placeholder="e.g. Products, Services (optional)" style={styles.input}
          />
        </div>

        {/* Description */}
        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description} onChange={handleInputChange}
            placeholder="Enter page description" style={styles.textarea} rows={5}
          />
        </div>

        {/* Photo Upload */}
        <div style={styles.field}>
          <label style={styles.label}>Photo</label>
          <input
            type="file" accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect} style={styles.fileInput}
          />
          <p style={styles.hint}>JPEG, PNG, WEBP · Max 5MB</p>
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div style={styles.field}>
            <label style={styles.label}>Preview</label>
            <div style={styles.previewBox}>
              <img src={previewUrl} alt="Preview" style={styles.previewImage} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          <button type="button" style={styles.cancelBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.65 : 1 }} disabled={loading}>
            {loading ? 'Saving…' : (page ? 'Update Page' : 'Create Page')}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px', margin: '0 auto', background: '#fff',
    borderRadius: '12px', padding: '32px',
    boxShadow: '0 4px 16px rgba(15,45,77,0.10)',
    border: '1px solid #d5dee7', fontFamily: "'Barlow', sans-serif"
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f2f5f8'
  },
  title: { fontSize: '22px', fontWeight: '700', color: '#0f2d4d', margin: 0, fontFamily: "'Sora', sans-serif" },
  closeBtn: {
    width: '34px', height: '34px', background: '#f2f5f8', border: '1px solid #d5dee7',
    borderRadius: '8px', fontSize: '16px', cursor: 'pointer', color: '#455b70'
  },
  errorBox: {
    background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: '8px',
    padding: '12px 16px', fontSize: '14px', color: '#c0392b', marginBottom: '20px',
    display: 'flex', alignItems: 'center', gap: '8px'
  },
  errorIcon: { fontSize: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#455b70', letterSpacing: '0.5px', textTransform: 'uppercase' },
  required: { color: '#d9732d' },
  input: {
    padding: '11px 14px', border: '1.5px solid #d5dee7', borderRadius: '8px',
    fontSize: '15px', outline: 'none', fontFamily: "'Barlow', sans-serif", color: '#112235', background: '#fff'
  },
  textarea: {
    padding: '11px 14px', border: '1.5px solid #d5dee7', borderRadius: '8px',
    fontSize: '15px', outline: 'none', fontFamily: "'Barlow', sans-serif",
    resize: 'vertical', color: '#112235', background: '#fff'
  },
  fileInput: {
    padding: '12px', border: '2px dashed #d5dee7', borderRadius: '8px',
    fontSize: '14px', cursor: 'pointer', background: '#f2f5f8'
  },
  hint: { fontSize: '12px', color: '#70879b', margin: 0 },
  previewBox: {
    width: '100%', maxWidth: '400px', height: '240px',
    border: '2px solid #d5dee7', borderRadius: '10px',
    overflow: 'hidden', background: '#f2f5f8'
  },
  previewImage: { width: '100%', height: '100%', objectFit: 'contain' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: {
    padding: '11px 22px', background: '#f2f5f8', color: '#455b70',
    border: '1px solid #d5dee7', borderRadius: '8px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer', fontFamily: "'Barlow', sans-serif"
  },
  submitBtn: {
    padding: '11px 22px', background: 'linear-gradient(135deg, #0f2d4d, #146c8a)',
    color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(15,45,77,0.25)', fontFamily: "'Barlow', sans-serif"
  }
};

export default PageForm;
