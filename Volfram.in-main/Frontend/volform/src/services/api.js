import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Set access token in sessionStorage
 */
export const setAccessToken = (token) => {
  sessionStorage.setItem('volfram_access_token', token);
};

/**
 * Get access token from sessionStorage
 */
export const getAccessToken = () => {
  return sessionStorage.getItem('volfram_access_token');
};

/**
 * Clear access token from sessionStorage
 */
export const clearAccessToken = () => {
  sessionStorage.removeItem('volfram_access_token');
  sessionStorage.removeItem('volfram_user');
};

/**
 * Set user data in sessionStorage
 */
export const setUser = (user) => {
  sessionStorage.setItem('volfram_user', JSON.stringify(user));
};

/**
 * Get user data from sessionStorage
 */
export const getUser = () => {
  const u = sessionStorage.getItem('volfram_user');
  return u ? JSON.parse(u) : null;
};

// Request interceptor - add access token to headers
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        clearAccessToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Auth API
 */
export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    clearAccessToken();
    return response.data;
  },

  // Refresh token
  refresh: async () => {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }
};

/**
 * Image Manager API (Admin)
 */
export const imageManagerAPI = {
  // Get images for a section (admin)
  getImages: async (section) => {
    const response = await api.get(`/admin/images/${section}`);
    return response.data;
  },
  
  // Upload multiple images to a section (with optional captions array)
  uploadImages: async (section, files, captions = [], descriptions = [], infos = [], eventId = '') => {
    const formData = new FormData();
    if (eventId) formData.append('eventId', eventId);
    Array.from(files).forEach((file) => formData.append('photos', file));
    captions.forEach((caption) => formData.append('captions', caption));
    descriptions.forEach((description) => formData.append('descriptions', description));
    infos.forEach((info) => formData.append('infos', info));
    const response = await api.post(`/admin/images/${section}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateImage: async (id, { file, caption, description, info }) => {
    const formData = new FormData();
    if (file) formData.append('photo', file);
    formData.append('caption', caption);
    formData.append('description', description);
    formData.append('info', info);
    const response = await api.put(`/admin/images/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  // Delete one image
  deleteImage: async (id) => {
    const response = await api.delete(`/admin/images/${id}`);
    return response.data;
  }
};

export const usersAPI = {
  getAll: async () => (await api.get('/users')).data
};

export const enquiriesAPI = {
  getAll: async () => (await api.get('/enquiries')).data
};

export const requirementsAPI = {
  create: async (payload) => (await api.post('/requirements', payload)).data,
  getMine: async () => (await api.get('/requirements/my-requirements')).data,
  getAll: async () => (await api.get('/requirements')).data,
  updateStatus: async (id, status) => (await api.put(`/requirements/${id}/status`, { status })).data
};

export const eventsAPI = {
  getAdmin: async () => (await api.get('/admin/events')).data,
  create: async (payload) => (await api.post('/admin/events', payload)).data,
  delete: async (id) => (await api.delete(`/admin/events/${id}`)).data
};

export const dashboardAPI = {
  getSummary: async () => (await api.get('/admin/dashboard')).data
};

export const chatbotLeadsAPI = {
  getAll: async () => (await api.get('/admin/chatbot-leads')).data,
  getMine: async () => (await api.get('/chat/my-leads')).data
};

export const fetchPublicEvents = async () => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';
  const response = await fetch(`${API_URL}/api/public-events`);
  const data = await response.json();
  return data.events || [];
};

/**
 * Public image fetch (no auth) — used by website pages
 */
export const fetchSectionImages = async (section) => {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';
  const response = await fetch(`${API_URL}/api/public-images/${section}`);
  const data = await response.json();
  return data.images || [];
};

export default api;

