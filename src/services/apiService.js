// src/services/apiService.js
import axios from 'axios';
import useAuthStore from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiService = {
  // Report related API calls
  getReports: async (month = '', ngoId = '') => {
    try {
      const params = {};
      if (month) params.month = month;
      if (ngoId) params.ngoId = ngoId;
      
      const response = await axios.get(`${API_URL}/reports`, {
        params,
        headers: { ...useAuthStore.getState().getAuthHeaders() }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reports' };
    }
  },
  
  getReportById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/reports/${id}`, {
        headers: { ...useAuthStore.getState().getAuthHeaders() }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch report' };
    }
  },
  
  createReport: async (reportData) => {
    try {
      const response = await axios.post(`${API_URL}/reports`, reportData, {
        headers: { ...useAuthStore.getState().getAuthHeaders() }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create report' };
    }
  },
  
  updateReport: async (id, reportData) => {
    try {
      const response = await axios.put(`${API_URL}/reports/${id}`, reportData, {
        headers: { ...useAuthStore.getState().getAuthHeaders() }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update report' };
    }
  },
  
  deleteReport: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/reports/${id}`, {
        headers: { ...useAuthStore.getState().getAuthHeaders() }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete report' };
    }
  },
  
  // Dashboard related API calls
  getDashboardData: async (month = '') => {
    try {
      const params = {};
      if (month) params.month = month;
      
      const response = await axios.get(`${API_URL}/dashboard`, {
        params,
        headers: { ...useAuthStore.getState().getAuthHeaders() }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  }
};

export default apiService;