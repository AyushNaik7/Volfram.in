import { useState, useEffect, useRef } from 'react';
import { imageManagerAPI } from '../../services/api';

// The 5 sections admin can manage
const SECTIONS = [
  { key: 'gallery',  label: 'Gallery',   icon: '🖼️' },
  { key: 'events',   label: 'Events',    icon: '📅' },
  { key: 'clients',  label: 'Clients',   icon: '🤝' },
  { key: 'about',    label: 'About Us',  icon: 'ℹ️'  },
  { key: 'products', label: 'Products',  icon: '⚙️' },
];

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:7000';

function ImageManager() {
  const [activeSection, setActiveSection] = useState('gallery');
  const [images, setImages]               = useState([]);
  const [loading, setLoading]             = useState(false);
  const [uploading, setUploading]         = useState(false);
  const [dragOver, setDragOver]           = useState(false);
  const [previews, setPreviews]           = useState([]);  // local previews before upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Load images whenever section changes
  useEffect(() => {
    loadImages();
  }, [activeSection]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await imageManagerAPI.getImages(activeSection);
      setImages(data.images || []);
    } catch (err) {
      console.error('Failed to load images:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle files selected via input or drag-drop
  const handleFiles = (files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const valid = Array.from(files).filter(f => validTypes.includes(f.type) && f.size <= 5 * 1024 * 1024);

    if (valid.length === 0) {
      alert('Only JPEG, PNG, WEBP images under 5MB are allowed.');
      return;
    }

    setSelectedFiles(valid);

    // Generate local previews
    const readers = valid.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ name: file.name, src: reader.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(setPreviews);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    try {
      setUploading(true);
      await imageManagerAPI.uploadImages(activeSection, selectedFiles);
      setSelectedFiles([]);
      setPreviews([]);
      await loadImages();
    } catch (err) {
      alert('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image from the website?')) return;
    try {
      await imageManagerAPI.deleteImage(id);
      await loadImages();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const clearPreviews = () => {
    setSelectedFiles([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={s.root}>
      
      {/* Section Tabs */}
      <div style={s.tabs}>
        {SECTIONS.map(sec => (
          <button
            key={sec.key}
            style={{ ...s.tab, ...(activeSection === sec.key ? s.tabActive : {}) }}
            onClick={() => { setActiveSection(sec.key); clearPreviews(); }}
          >
            <span>{sec.icon}</span>
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div
        style={{ ...s.dropzone, ...(dragOver ? s.dropzoneActive : {}) }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
        <div style={s.dropzoneIcon}>📁</div>
        <p style={s.dropzoneTitle}>Drag & drop images here or click to browse</p>
        <p style={s.dropzoneHint}>JPEG, PNG, WEBP · Max 5MB each · Multiple files allowed</p>
      </div>

      {/* Selected file previews (before upload) */}
      {previews.length > 0 && (
        <div style={s.previewSection}>
          <div style={s.previewHeader}>
            <span style={s.previewTitle}>Ready to upload — {previews.length} image{previews.length > 1 ? 's' : ''}</span>
            <div style={s.previewActions}>
              <button style={s.cancelBtn} onClick={clearPreviews}>Cancel</button>
              <button
                style={{ ...s.uploadBtn, opacity: uploading ? 0.7 : 1 }}
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : `Upload ${previews.length} Image${previews.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
          <div style={s.previewGrid}>
            {previews.map((p, i) => (
              <div key={i} style={s.previewCard}>
                <img src={p.src} alt={p.name} style={s.previewImg} />
                <p style={s.previewName}>{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={s.divider}>
        <span style={s.dividerLabel}>
          {SECTIONS.find(s => s.key === activeSection)?.label} — {images.length} image{images.length !== 1 ? 's' : ''} on website
        </span>
      </div>

      {/* Existing images grid */}
      {loading ? (
        <p style={s.loadingText}>Loading images...</p>
      ) : images.length === 0 ? (
        <div style={s.emptyBox}>
          <p style={s.emptyText}>No images uploaded yet for this section.</p>
          <p style={s.emptyHint}>Upload images above — they will appear on the website automatically.</p>
        </div>
      ) : (
        <div style={s.imageGrid}>
          {images.map(img => (
            <div key={img._id} style={s.imageCard}>
              <div style={s.imageWrap}>
                <img
                  src={`${BASE_URL}${img.imageUrl}`}
                  alt={img.caption || 'Site image'}
                  style={s.image}
                />
              </div>
              <div style={s.imageFooter}>
                <span style={s.imageDate}>
                  {new Date(img.createdAt).toLocaleDateString()}
                </span>
                <button
                  style={s.deleteBtn}
                  onClick={() => handleDelete(img._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const s = {
  root: {
    fontFamily: "'Barlow', sans-serif",
    maxWidth: '1200px',
    margin: '0 auto'
  },
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px'
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 18px',
    background: '#fff',
    border: '1px solid #d5dee7',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#455b70',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Barlow', sans-serif"
  },
  tabActive: {
    background: 'linear-gradient(135deg, #0f2d4d, #146c8a)',
    color: '#fff',
    border: '1px solid #0f2d4d'
  },
  dropzone: {
    border: '2px dashed #d5dee7',
    borderRadius: '14px',
    padding: '40px 24px',
    textAlign: 'center',
    background: '#f2f5f8',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '24px'
  },
  dropzoneActive: {
    border: '2px dashed #146c8a',
    background: 'rgba(20,108,138,0.06)'
  },
  dropzoneIcon: {
    fontSize: '40px',
    marginBottom: '12px'
  },
  dropzoneTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f2d4d',
    margin: '0 0 6px 0'
  },
  dropzoneHint: {
    fontSize: '13px',
    color: '#70879b',
    margin: 0
  },
  previewSection: {
    background: '#fff',
    border: '1px solid #d5dee7',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px'
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  previewTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#0f2d4d'
  },
  previewActions: {
    display: 'flex',
    gap: '10px'
  },
  cancelBtn: {
    padding: '8px 18px',
    background: '#f2f5f8',
    border: '1px solid #d5dee7',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#455b70',
    fontFamily: "'Barlow', sans-serif"
  },
  uploadBtn: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #d9732d, #b85e1f)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(217,115,45,0.3)',
    fontFamily: "'Barlow', sans-serif"
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px'
  },
  previewCard: {
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #d5dee7'
  },
  previewImg: {
    width: '100%',
    height: '90px',
    objectFit: 'cover',
    display: 'block'
  },
  previewName: {
    fontSize: '11px',
    color: '#70879b',
    padding: '4px 6px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0
  },
  divider: {
    borderTop: '2px solid #f2f5f8',
    marginBottom: '20px',
    paddingTop: '20px'
  },
  dividerLabel: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f2d4d',
    fontFamily: "'Sora', sans-serif"
  },
  loadingText: {
    textAlign: 'center',
    padding: '40px',
    color: '#70879b',
    fontSize: '15px'
  },
  emptyBox: {
    textAlign: 'center',
    padding: '48px',
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #d5dee7'
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#455b70',
    margin: '0 0 8px 0'
  },
  emptyHint: {
    fontSize: '13px',
    color: '#70879b',
    margin: 0
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px'
  },
  imageCard: {
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #d5dee7',
    boxShadow: '0 2px 8px rgba(15,45,77,0.06)'
  },
  imageWrap: {
    width: '100%',
    height: '150px',
    overflow: 'hidden',
    background: '#f2f5f8'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },
  imageFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px'
  },
  imageDate: {
    fontSize: '11px',
    color: '#70879b'
  },
  deleteBtn: {
    padding: '4px 12px',
    background: '#fee2e2',
    color: '#c0392b',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Barlow', sans-serif"
  }
};

export default ImageManager;
