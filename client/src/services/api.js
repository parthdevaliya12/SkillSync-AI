import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillsync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('skillsync_token');
        localStorage.removeItem('skillsync_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

export const skillService = {
  getMasterSkills: (params) => api.get('/skills', { params }),
  getUserSkills: () => api.get('/skills/user'),
  addUserSkill: (data) => api.post('/skills/user', data),
  updateUserSkill: (id, data) => api.put(`/skills/user/${id}`, data),
  deleteUserSkill: (id) => api.delete(`/skills/user/${id}`),
};

export const jobService = {
  analyzeJob: (formData) => {
    return api.post('/jobs/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getJobs: () => api.get('/jobs'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

export const gapService = {
  calculateGap: (jobId) => api.post(`/skill-gap/${jobId}`),
  getGap: (jobId) => api.get(`/skill-gap/${jobId}`),
};

export const roadmapService = {
  generateRoadmap: (data) => api.post('/roadmaps/generate', data),
  getRoadmaps: () => api.get('/roadmaps'),
  getRoadmapById: (id) => api.get(`/roadmaps/${id}`),
  updateTask: (taskId, isCompleted) => api.put(`/roadmaps/tasks/${taskId}`, { isCompleted }),
  deleteRoadmap: (id) => api.delete(`/roadmaps/${id}`),
};

export const aiService = {
  sendMessage: (message) => api.post('/ai/chat', { message }),
  getHistory: (limit = 50) => api.get('/ai/history', { params: { limit } }),
  clearHistory: () => api.delete('/ai/history'),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getProgress: () => api.get('/dashboard/progress'),
};

export default api;
