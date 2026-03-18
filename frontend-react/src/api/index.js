import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach bearer token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

// Projects
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProject = (id, data) => api.post(`/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Skills
export const getSkills = () => api.get('/skills');
export const createSkill = (data) => api.post('/skills', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateSkill = (id, data) => api.post(`/skills/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

// Experiences
export const getExperiences = () => api.get('/experiences');
export const createExperience = (data) => api.post('/experiences', data);
export const updateExperience = (id, data) => api.put(`/experiences/${id}`, data);
export const deleteExperience = (id) => api.delete(`/experiences/${id}`);

// Messages
export const getMessages = () => api.get('/messages');
export const getMessageStats = () => api.get('/messages/stats');
export const getMessage = (id) => api.get(`/messages/${id}`);
export const readMessage = (id) => api.put(`/messages/${id}/read`);
export const deleteMessage = (id) => api.delete(`/messages/${id}`);
export const sendContact = (data) => api.post('/contact', data);

// Certificates
export const getCertificates = () => api.get('/certificates');
export const getCertificate = (id) => api.get(`/certificates/${id}`);
export const createCertificate = (data) => api.post('/certificates', data, { headers: { 'Content-Type': 'multipart/form-data' }});
export const updateCertificate = (id, data) => api.post(`/certificates/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
export const deleteCertificate = (id) => api.delete(`/certificates/${id}`);

export default api;
