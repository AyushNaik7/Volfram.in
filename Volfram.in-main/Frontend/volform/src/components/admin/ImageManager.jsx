import { useState, useEffect, useRef, useCallback } from 'react';
import { eventsAPI, imageManagerAPI } from '../../services/api';

const SECTIONS = [
  { key: 'gallery',  label: 'Gallery',   icon: '🖼️' },
  { key: 'events',   label: 'Events',    icon: '📅' },
  { key: 'clients',  label: 'Clients',   icon: '🤝' },
  { key: 'about',    label: 'About Us',  icon: 'ℹ️'  },
  { key: 'products', label: 'Products',  icon: '⚙️' },
];

const DEFAULT_EVENT_OPTIONS = [
  { id: 'annual-2025', title: 'Annual Conference 2025-26' },
  { id: 'boiler-india-2024', title: 'Boiler India 2024' },
  { id: 'chemtech-2024', title: 'Chemtech 2024' },
  { id: 'annual-2024', title: 'Annual Conference 2024-25' },
  { id: 'boiler-world', title: 'Boiler World Expo' }
];

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:7000';

function ImageManager() {
  const [activeSection, setActiveSection]   = useState('gallery');
  const [eventOptions, setEventOptions] = useState(DEFAULT_EVENT_OPTIONS);
  const [selectedEventId, setSelectedEventId] = useState(DEFAULT_EVENT_OPTIONS[0].id);
  const [showEventForm, setShowEventForm] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', location: '' });
  const [images, setImages]                 = useState([]);
  const [loading, setLoading]               = useState(false);
  const [uploading, setUploading]           = useState(false);
  const [dragOver, setDragOver]             = useState(false);
  // Each entry: { name, src, file, caption, description, info }
  const [previewItems, setPreviewItems]     = useState([]);
  const fileInputRef = useRef(null);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await imageManagerAPI.getImages(activeSection);
      setImages(data.images || []);
    } catch (err) {
      console.error('Failed to load images:', err);
    } finally {
      setLoading(false);
    }
  }, [activeSection]);

  // The effect synchronizes the selected admin section with the API.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadImages(); }, [loadImages]);

  useEffect(() => {
    eventsAPI.getAdmin().then(data => {
      if (data.events?.length) {
        const savedEvents = data.events.map(event => ({ id: event._id, title: event.title, ...event }));
        setEventOptions(current => [...current, ...savedEvents.filter(event => !current.some(item => item.id === event.id))]);
      }
    }).catch(() => {});
  }, []);

  const handleFiles = (files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const valid = Array.from(files).filter(
      f => validTypes.includes(f.type) && f.size <= 5 * 1024 * 1024
    );
    if (valid.length === 0) {
      alert('Only JPEG, PNG, WEBP images under 5MB are allowed.');
      return;
    }
    const readers = valid.map(file =>
      new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ name: file.name, src: reader.result, file, caption: '', description: '', info: '' });
        reader.readAsDataURL(file);
      })
    );
    Promise.all(readers).then(items => setPreviewItems(items));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleCaptionChange = (index, value) => {
    setPreviewItems(prev =>
      prev.map((item, i) => i === index ? { ...item, caption: value } : item)
    );
  };

  const handleMetadataChange = (index, field, value) => {
    setPreviewItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleUpload = async () => {
    if (previewItems.length === 0) return;
    if (previewItems.some(item => !item.caption.trim() || !item.description.trim() || !item.info.trim())) {
      alert('Add a title, description, and photo information for every image before uploading.');
      return;
    }
    try {
      setUploading(true);
      const files    = previewItems.map(p => p.file);
      const captions = previewItems.map(p => p.caption);
      const descriptions = previewItems.map(p => p.description);
      const infos = previewItems.map(p => p.info);
      await imageManagerAPI.uploadImages(activeSection, files, captions, descriptions, infos, selectedEventId);
      setPreviewItems([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadImages();
    } catch (err) {
      alert('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateEvent = async (event) => {
    event.preventDefault();
    setCreatingEvent(true);
    try {
      const data = await eventsAPI.create(newEvent);
      const created = { id: data.event._id, title: data.event.title, ...data.event };
      setEventOptions(current => [created, ...current.filter(item => item.id !== created.id)]);
      setSelectedEventId(created.id);
      setNewEvent({ title: '', description: '', date: '', location: '' });
      setShowEventForm(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to create event album.');
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleDeleteEvent = async () => {
    const selectedEvent = eventOptions.find(event => event.id === selectedEventId);
    if (!selectedEvent || DEFAULT_EVENT_OPTIONS.some(event => event.id === selectedEventId)) return;
    if (!window.confirm(`Delete "${selectedEvent.title}" and all of its uploaded images?`)) return;

    try {
      setDeletingEvent(true);
      await eventsAPI.delete(selectedEventId);
      const nextEvents = eventOptions.filter(event => event.id !== selectedEventId);
      setEventOptions(nextEvents);
      setSelectedEventId(nextEvents[0]?.id || DEFAULT_EVENT_OPTIONS[0].id);
      await loadImages();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to delete event.');
    } finally {
      setDeletingEvent(false);
    }
  };

  const handleEdit = async (image) => {
    const caption = window.prompt('Photo title', image.caption || '');
    if (caption === null) return;
    const description = window.prompt('Description', image.description || '');
    if (description === null) return;
    const info = window.prompt('Photo information', image.info || '');
    if (info === null) return;
    if (!caption.trim() || !description.trim() || !info.trim()) {
      alert('Title, description, and photo information are required.');
      return;
    }
    try {
      await imageManagerAPI.updateImage(image._id, { caption, description, info });
      await loadImages();
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image from the website?')) return;
    try {
      await imageManagerAPI.deleteImage(id);
      await loadImages();
    } catch {
      alert('Delete failed.');
    }
  };

  const clearPreviews = () => {
    setPreviewItems([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayedImages = activeSection === 'events'
    ? images.filter(image => image.eventId === selectedEventId)
    : images;

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

      {/* Upload Drop Zone */}
      {activeSection === 'events' && (
        <div style={s.eventSelector}>
          <div><p style={s.eventSelectorEyebrow}>EVENT ALBUM</p><h3 style={s.eventSelectorTitle}>Where should these photos appear?</h3><p style={s.eventSelectorHint}>Select an album or create a new event before uploading.</p></div>
          <div style={s.eventSelectorActions}><select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} style={s.eventSelect}>{eventOptions.map(event => <option key={event.id} value={event.id}>{event.title}</option>)}</select>{!DEFAULT_EVENT_OPTIONS.some(event => event.id === selectedEventId) && <button type="button" style={s.deleteEventBtn} onClick={handleDeleteEvent} disabled={deletingEvent}>{deletingEvent ? 'Deleting...' : 'Delete event'}</button>}<button type="button" style={s.newEventBtn} onClick={() => setShowEventForm(current => !current)}>+ New event</button></div>
        </div>
      )}
      {activeSection === 'events' && showEventForm && <form style={s.eventForm} onSubmit={handleCreateEvent}><div><p style={s.eventSelectorEyebrow}>NEW ALBUM</p><h3 style={s.eventSelectorTitle}>Create an event</h3></div><div style={s.eventFormGrid}><input required placeholder="Event title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} style={s.eventFormInput} /><input required placeholder="Date or year" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} style={s.eventFormInput} /><input required placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} style={s.eventFormInput} /><textarea required rows={3} placeholder="Event description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} style={s.eventFormInput} /></div><div style={s.eventFormActions}><button type="button" style={s.cancelBtn} onClick={() => setShowEventForm(false)}>Cancel</button><button type="submit" style={s.uploadBtn} disabled={creatingEvent}>{creatingEvent ? 'Creating...' : 'Create event album'}</button></div></form>}
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
        <p style={s.dropzoneTitle}>{activeSection === 'events' ? 'Add photos to this event album' : 'Drag & drop images here or click to browse'}</p>
        <p style={s.dropzoneHint}>JPEG, PNG, WEBP · Max 5MB each · Multiple files allowed</p>
      </div>

      {/* Preview + required image metadata */}
      {previewItems.length > 0 && (
        <div style={s.previewSection}>
          <div style={s.previewHeader}>
            <span style={s.previewTitle}>
              Ready to upload — {previewItems.length} image{previewItems.length > 1 ? 's' : ''}
            </span>
            <div style={s.previewActions}>
              <button style={s.cancelBtn} onClick={clearPreviews}>Cancel</button>
              <button
                style={{ ...s.uploadBtn, opacity: uploading ? 0.7 : 1 }}
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : `Upload ${previewItems.length} Image${previewItems.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>

          <div style={s.previewGrid}>
            {previewItems.map((item, i) => (
              <div key={i} style={s.previewCard}>
                <img src={item.src} alt={item.name} style={s.previewImg} />
                <div style={s.previewMeta}>
                  <p style={s.previewName} title={item.name}>{item.name}</p>
                  <label style={s.fieldLabel}>Photo title <span>Required</span><input
                    type="text"
                    placeholder="e.g. Boiler installation"
                    value={item.caption}
                    onChange={e => handleCaptionChange(i, e.target.value)}
                    style={s.captionInput}
                    onClick={e => e.stopPropagation()}
                  /></label>
                  <label style={s.fieldLabel}>Description <span>Required</span><textarea
                    placeholder="Describe what this photo shows"
                    value={item.description}
                    onChange={e => handleMetadataChange(i, 'description', e.target.value)}
                    style={s.metadataInput}
                    rows={2}
                    onClick={e => e.stopPropagation()}
                  /></label>
                  <label style={s.fieldLabel}>Photo information <span>Required</span><textarea
                    placeholder="Project, location, equipment, or useful context"
                    value={item.info}
                    onChange={e => handleMetadataChange(i, 'info', e.target.value)}
                    style={s.metadataInput}
                    rows={2}
                    onClick={e => e.stopPropagation()}
                  /></label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={s.divider}>
        <span style={s.dividerLabel}>
          {SECTIONS.find(sec => sec.key === activeSection)?.label}{activeSection === 'events' ? ` / ${eventOptions.find(event => event.id === selectedEventId)?.title}` : ''} — {displayedImages.length} image{displayedImages.length !== 1 ? 's' : ''} on website
        </span>
      </div>

      {/* Existing images */}
      {loading ? (
        <p style={s.loadingText}>Loading images...</p>
      ) : displayedImages.length === 0 ? (
        <div style={s.emptyBox}>
          <p style={s.emptyText}>No images uploaded yet for this section.</p>
          <p style={s.emptyHint}>Upload images above — they will appear on the website automatically.</p>
        </div>
      ) : (
        <div style={s.imageGrid}>
          {displayedImages.map(img => (
            <div key={img._id} className="image-manager-card" style={s.imageCard}>
              <div style={s.imageWrap}>
                <img
                  src={`${BASE_URL}${img.imageUrl}`}
                  alt={img.caption || 'Site image'}
                  style={s.image}
                />
              </div>
              <div style={s.imageBody}>
                <p style={s.captionText}>{img.caption || 'Untitled image'}</p>
                {img.description && <p style={s.descriptionText}>{img.description}</p>}
                {img.info && <p style={s.infoText}>{img.info}</p>}
                <div style={s.imageFooter}>
                  <span style={s.imageDate}>
                    {new Date(img.createdAt).toLocaleDateString()}
                  </span>
                  <button style={s.deleteBtn} onClick={() => handleDelete(img._id)}>
                    Delete
                  </button>
                  <button style={s.editBtn} onClick={() => handleEdit(img)}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  root: { fontFamily: "'Barlow', sans-serif", maxWidth: '1200px', margin: '0 auto' },
  tabs: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' },
  tab: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '9px 18px', background: '#fff', border: '1px solid #d5dee7',
    borderRadius: '8px', fontSize: '14px', fontWeight: '500',
    color: '#455b70', cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: "'Barlow', sans-serif"
  },
  tabActive: {
    background: 'linear-gradient(135deg, #0f2d4d, #146c8a)',
    color: '#fff', border: '1px solid #0f2d4d'
  },
  dropzone: {
    border: '2px dashed #d5dee7', borderRadius: '14px', padding: '40px 24px',
    textAlign: 'center', background: '#f2f5f8', cursor: 'pointer',
    transition: 'all 0.2s', marginBottom: '24px'
  },
  dropzoneActive: { border: '2px dashed #146c8a', background: 'rgba(20,108,138,0.06)' },
  dropzoneIcon: { fontSize: '40px', marginBottom: '12px' },
  dropzoneTitle: { fontSize: '16px', fontWeight: '600', color: '#0f2d4d', margin: '0 0 6px 0' },
  dropzoneHint: { fontSize: '13px', color: '#70879b', margin: 0 },
  eventSelector: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px',
    padding: '18px 20px', marginBottom: '14px', border: '1px solid #cdd9e2',
    borderRadius: '12px', background: 'linear-gradient(120deg, #f8fbfc, #eef5f7)'
  },
  eventSelectorEyebrow: { margin: '0 0 5px', color: '#d9732d', fontSize: '10px', fontWeight: '700', letterSpacing: '1.6px' },
  eventSelectorTitle: { margin: 0, color: '#0f2d4d', font: "700 16px 'Sora', sans-serif" },
  eventSelectorHint: { margin: '5px 0 0', color: '#70879b', fontSize: '12px' },
  eventSelect: { minWidth: '250px', padding: '11px 13px', border: '1px solid #b9c8d4', borderRadius: '8px', background: '#fff', color: '#0f2d4d', font: "600 13px 'Barlow', sans-serif" },
  eventSelectorActions: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' },
  newEventBtn: { padding: '10px 13px', border: '1px solid #146c8a', borderRadius: '8px', background: '#fff', color: '#146c8a', font: "600 13px 'Barlow', sans-serif", cursor: 'pointer' },
  eventForm: { padding: '18px 20px', marginBottom: '14px', border: '1px solid #cdd9e2', borderRadius: '12px', background: '#fff', boxShadow: '0 8px 22px rgba(15,45,77,.07)' },
  eventFormGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' },
  eventFormInput: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #d5dee7', borderRadius: '7px', color: '#0f2d4d', background: '#f8fafc', font: "13px 'Barlow', sans-serif" },
  eventFormActions: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' },

  previewSection: {
    background: '#fff', border: '1px solid #d5dee7',
    borderRadius: '12px', padding: '20px', marginBottom: '24px'
  },
  previewHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '16px', flexWrap: 'wrap', gap: '12px'
  },
  previewTitle: { fontSize: '15px', fontWeight: '600', color: '#0f2d4d' },
  previewActions: { display: 'flex', gap: '10px' },
  cancelBtn: {
    padding: '8px 18px', background: '#f2f5f8', border: '1px solid #d5dee7',
    borderRadius: '8px', fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', color: '#455b70', fontFamily: "'Barlow', sans-serif"
  },
  uploadBtn: {
    padding: '8px 20px', background: 'linear-gradient(135deg, #d9732d, #b85e1f)',
    border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
    color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(217,115,45,0.3)',
    fontFamily: "'Barlow', sans-serif"
  },
  previewGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px'
  },
  previewCard: {
    borderRadius: '10px', overflow: 'hidden',
    border: '1px solid #d5dee7', background: '#fff'
  },
  previewImg: { width: '100%', height: '110px', objectFit: 'cover', display: 'block' },
  previewMeta: { padding: '8px' },
  previewName: {
    fontSize: '11px', color: '#70879b', margin: '0 0 6px 0',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
  },
  captionInput: {
    width: '100%', boxSizing: 'border-box',
    padding: '6px 8px', border: '1px solid #d5dee7', borderRadius: '6px',
    fontSize: '12px', fontFamily: "'Barlow', sans-serif",
    color: '#112235', outline: 'none', background: '#f8fafc'
  },
  fieldLabel: { display: 'block', marginTop: '8px', color: '#455b70', fontSize: '11px', fontWeight: '600' },
  fieldRequired: { color: '#d9732d' },
  metadataInput: {
    width: '100%', boxSizing: 'border-box', resize: 'vertical',
    padding: '6px 8px', border: '1px solid #d5dee7', borderRadius: '6px',
    fontSize: '12px', fontFamily: "'Barlow', sans-serif",
    color: '#112235', outline: 'none', background: '#f8fafc', marginTop: '4px'
  },

  divider: { borderTop: '2px solid #f2f5f8', marginBottom: '20px', paddingTop: '20px' },
  dividerLabel: { fontSize: '15px', fontWeight: '700', color: '#0f2d4d', fontFamily: "'Sora', sans-serif" },

  loadingText: { textAlign: 'center', padding: '40px', color: '#70879b', fontSize: '15px' },
  emptyBox: {
    textAlign: 'center', padding: '48px', background: '#fff',
    borderRadius: '12px', border: '1px solid #d5dee7'
  },
  emptyText: { fontSize: '16px', fontWeight: '600', color: '#455b70', margin: '0 0 8px 0' },
  emptyHint: { fontSize: '13px', color: '#70879b', margin: 0 },

  imageGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '18px'
  },
  imageCard: {
    gridColumn: 'span 4', background: '#fff', borderRadius: '14px', overflow: 'hidden',
    border: '1px solid #d5dee7', boxShadow: '0 8px 24px rgba(15,45,77,0.08)'
  },
  imageWrap: { width: '100%', aspectRatio: '1.45', overflow: 'hidden', background: '#f2f5f8' },
  image: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  imageBody: { padding: '10px 12px' },
  captionText: {
    fontSize: '16px', color: '#0f2d4d', margin: '0 0 6px 0',
    lineHeight: '1.3', fontWeight: '700', fontFamily: "'Sora', sans-serif"
  },
  descriptionText: { fontSize: '13px', color: '#455b70', margin: '0 0 8px', lineHeight: '1.45' },
  infoText: { fontSize: '12px', color: '#70879b', margin: '0 0 12px', lineHeight: '1.45', paddingTop: '9px', borderTop: '1px solid #edf1f4' },
  imageFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  imageDate: { fontSize: '11px', color: '#70879b' },
  deleteBtn: {
    padding: '4px 12px', background: '#fee2e2', color: '#c0392b',
    border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer', fontFamily: "'Barlow', sans-serif"
  },
  editBtn: {
    padding: '4px 12px', background: '#e8f2f5', color: '#146c8a',
    border: '1px solid #b9d4dc', borderRadius: '6px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer', fontFamily: "'Barlow', sans-serif"
  },
  deleteEventBtn: {
    padding: '10px 13px', border: '1px solid #fca5a5', borderRadius: '8px',
    background: '#fff5f5', color: '#c0392b', font: "600 13px 'Barlow', sans-serif", cursor: 'pointer'
  }
};

export default ImageManager;
