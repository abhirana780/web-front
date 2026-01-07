import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add JWT token from cookies
axiosInstance.interceptors.request.use(
  (config) => {
    // Get JWT token from cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid, clear cookies and redirect to login
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/onBoard';
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  // Register new student
  register: (studentData) => {
    return axiosInstance.post('/auth/register', studentData);
  },

  // Logout
  logout: () => {
    return axiosInstance.post('/auth/logout');
  },

  // Employee Login
  employeeLogin: (credentials) => {
    return axiosInstance.post('/auth/login', credentials);
  },

  // Get current user profile
  getProfile: () => {
    return axiosInstance.get('/auth/profile');
  }
};

// Student management API methods
export const studentAPI = {
  // Get student by email (no auth required for onboarding)
  getStudentByEmail: (email) => {
    return axios.get(`http://localhost:5001/api/student/by-email?email=${encodeURIComponent(email)}`);
  },

  // Update student by email (for onboarding updates)
  updateStudentByEmail: (studentData) => {
    return axios.put('http://localhost:5001/api/student/by-email', studentData);
  },

  // Update student with profile picture
  updateStudentWithProfilePicture: (formData) => {
    return axios.put('http://localhost:5001/api/student/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get full profile picture URL
  getProfilePictureUrl: (profilePicturePath) => {
    if (!profilePicturePath) return null;
    if (profilePicturePath.startsWith('http')) {
      return profilePicturePath; // External URL
    }
    return `http://localhost:5001/uploads/${profilePicturePath}`; // Local file
  }
};

// Image upload API methods
export const imageAPI = {
  // Upload image
  uploadImage: (formData) => {
    return axiosInstance.post('/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete image
  deleteImage: (filePath) => {
    return axiosInstance.delete(`/image/${encodeURIComponent(filePath)}`);
  },

  // Get image metadata
  getImageMetadata: (filePath) => {
    return axiosInstance.get(`/image/${encodeURIComponent(filePath)}/metadata`);
  }
};

// Export axios instance as default
export default axiosInstance;
