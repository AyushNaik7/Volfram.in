import { useState, useEffect } from 'react';
import { pagesAPI } from '../../services/api';

/**
 * Page Form Component
 * Add/Edit page with photo upload and preview
 */
function PageForm({ page, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate form if editing existing page
  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        description: page.description || '',
        category: page.category || ''
      });
      
      if (page.imageUrl) {
        setPreviewUrl(`http://localhost:7000${page.imageUrl}`);
      }
    }
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setSelectedFile(file);

    // Create preview using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      alert('Title is required.');
      return;
    }

    try {
      setLoading(true);

      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      
      if (selectedFile) {
        submitData.append('photo', selectedFile);
      }

      // Call API
      if (page) {
        // Update existing page
        await pagesAPI.update(page._id, submitData);
        alert('Page updated successfully!');
      } else {
        // Create new page
        await pagesAPI.create(submitData);
        alert('Page created successfully!');
      }

      onClose(); // Close form and refresh list
    } catch (error) {
      console.error('Error saving page:', error);
      alert(error.response?.data?.message || 'Failed to save page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {page ? 'Edit Page' : 'Add New Page'}
        </h2>
        <button style={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Title */}
        <div style={styles.field}>
          <label style={styles.label}>
            Page Title <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter page title"
            style={styles.input}
            required
          />
        </div>

        {/* Category */}
        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Enter category (optional)"
            style={styles.input}
          />
        </div>

        {/* Description */}
        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter page description"
            style={styles.textarea}
            rows={5}
          />
        </div>

        {/* Photo Upload */}
        <div style={styles.field}>
          <label style={styles.label}>Photo Upload</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            style={styles.fileInput}
          />
          <p style={styles.hint}>
            Accepts: JPEG, PNG, WEBP | Max size: 5MB
          </p>
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div style={styles.previewContainer}>
            <label style={styles.label}>Preview</label>
            <div style={styles.previewBox}>
              <img
                src={previewUrl}
                alt="Preview"
                style={styles.previewImage}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div style={styles.actions}>
          <button
            type="button"
            style={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Saving...' : (page ? 'Update Page' : 'Create Page')}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 16px rgba(15,45,77,0.10)',
    border: '1px solid #d5dee7',
    fontFamily: "'Barlow', sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f2f5f8'
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f2d4d',
    margin: 0,
    fontFamily: "'Sora', sans-serif"
  },
  closeBtn: {
    width: '34px',
    height: '34px',
    background: '#f2f5f8',
    border: '1px solid #d5dee7',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#455b70'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#112235',
    letterSpacing: '0.3px',
    textTransform: 'uppercase'
  },
  required: {
    color: '#d9732d'
  },
  input: {
    padding: '11px 14px',
    border: '1px solid #d5dee7',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: "'Barlow', sans-serif",
    color: '#112235',
    background: '#fff'
  },
  textarea: {
    padding: '11px 14px',
    border: '1px solid #d5dee7',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: "'Barlow', sans-serif",
    resize: 'vertical',
    color: '#112235',
    background: '#fff'
  },
  fileInput: {
    padding: '12px',
    border: '2px dashed #d5dee7',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    background: '#f2f5f8'
  },
  hint: {
    fontSize: '12px',
    color: '#70879b',
    margin: 0
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  previewBox: {
    width: '100%',
    maxWidth: '400px',
    height: '240px',
    border: '2px solid #d5dee7',
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#f2f5f8'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px'
  },
  cancelBtn: {
    padding: '11px 22px',
    background: '#f2f5f8',
    color: '#455b70',
    border: '1px solid #d5dee7',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Barlow', sans-serif"
  },
  submitBtn: {
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
  }
};

export default PageForm;
