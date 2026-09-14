const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

/**
 * Universal fetch wrapper with credentials (cookies) and Authorization header support.
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('spotify_token');
  const headers = {
    ...(options.headers || {}),
  };

  // Attach token header if available and not explicitly skipped
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Do not set Content-Type if sending FormData (let the browser set boundary)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Ensures cookies are sent and received
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || data.error || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authAPI = {
  async register({ username, email, password, role = 'user' }) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, role }),
    });
    if (data.token) {
      localStorage.setItem('spotify_token', data.token);
    }
    return data;
  },

  async login({ identifier, email, username, password }) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: identifier || email || username, password }),
    });
    if (data.token) {
      localStorage.setItem('spotify_token', data.token);
    }
    return data;
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('spotify_token');
    }
  },

  async getMe() {
    return await apiRequest('/auth/me');
  },
};

export const musicAPI = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `/music${query ? `?${query}` : ''}`;
    return await apiRequest(url);
  },

  async getById(id) {
    return await apiRequest(`/music/${id}`);
  },

  async getMyMusic() {
    return await apiRequest('/music/my-music');
  },

  async upload({ title, file }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    return await apiRequest('/music/upload', {
      method: 'POST',
      body: formData,
    });
  },
};

export const albumAPI = {
  async getAll() {
    return await apiRequest('/albums');
  },

  async getById(id) {
    return await apiRequest(`/albums/${id}`);
  },

  async getMyAlbums() {
    return await apiRequest('/albums/my-albums');
  },

  async create({ title, musicId }) {
    return await apiRequest('/albums', {
      method: 'POST',
      body: JSON.stringify({ title, musicId }),
    });
  },
};
