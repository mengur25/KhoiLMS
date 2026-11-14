const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const getAuthHeaders = () => {
  const token = localStorage.getItem('khoi_lms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Đã xảy ra lỗi kết nối');
  }
  return data;
};

export const api = {
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  lessons: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/lessons`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/lessons/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_BASE}/lessons`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/lessons/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/lessons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  submissions: {
    checkGoogleForm: async (lessonId) => {
      const res = await fetch(`${API_BASE}/submissions/check/${lessonId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    simulate: async (data) => {
      const res = await fetch(`${API_BASE}/submissions/simulate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    getMySubmissions: async () => {
      const res = await fetch(`${API_BASE}/submissions/my`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getAllSubmissions: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/submissions/all?${query}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  goals: {
    getGoals: async (date) => {
      const query = date ? `?date=${date}` : '';
      const res = await fetch(`${API_BASE}/goals${query}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    create: async (title, date, dayNumber) => {
      const res = await fetch(`${API_BASE}/goals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, date, dayNumber }),
      });
      return handleResponse(res);
    },
    toggle: async (id) => {
      const res = await fetch(`${API_BASE}/goals/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/goals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  admin: {
    getStats: async () => {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getStudents: async () => {
      const res = await fetch(`${API_BASE}/admin/students`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getGuide: async () => {
      const res = await fetch(`${API_BASE}/admin/guide`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
