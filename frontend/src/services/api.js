import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const medicationService = {
  // Get all medications
  getAllMedications: async () => {
    const response = await api.get('/medications/');
    return response.data;
  },

  // Create a new medication
  createMedication: async (medication) => {
    const response = await api.post('/medications/', medication);
    return response.data;
  },

  // Update a medication
  updateMedication: async (id, medication) => {
    const response = await api.put(`/medications/${id}`, medication);
    return response.data;
  },

  // Delete a medication
  deleteMedication: async (id) => {
    await api.delete(`/medications/${id}`);
  },

  // Check drug interactions
  checkInteractions: async (medications) => {
    const response = await api.post('/medications/check-interactions', {
      medications,
    });
    return response.data;
  },
};

export default api;
