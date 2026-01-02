import axios from "axios";
import { BACKEND_URL } from "../utils/utils";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally trigger a custom event for components to listen to
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(error);
  }
);

/**
 * API Service for Command Pilot
 * All API endpoints are centralized here
 */

// ==================== USER ENDPOINTS ====================

/**
 * Health check endpoint
 * @returns {Promise} API status
 */
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get("/api/user/checker");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Health check failed");
  }
};

/**
 * User registration
 * @param {Object} userData - { username, email, password }
 * @returns {Promise} User data and token
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/api/user/register", userData);
    
    // Store token and user data if provided
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Registration failed";
    throw new Error(errorMessage);
  }
};

/**
 * User login
 * @param {Object} credentials - { email, password }
 * @returns {Promise} User data and token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/api/user/login", credentials);
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};

/**
 * User logout
 * @returns {Promise} Success message
 */
export const logoutUser = async () => {
  try {
    const response = await apiClient.get("/api/user/logout");
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    return response.data;
  } catch (error) {
    // Even if API call fails, clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    const errorMessage = error.response?.data?.message || "Logout failed";
    throw new Error(errorMessage);
  }
};

/**
 * Get user's saved commands
 * @returns {Promise} Array of user commands
 */
export const getUserCommands = async () => {
  try {
    const response = await apiClient.get("/api/user/getMyCommand");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch commands";
    throw new Error(errorMessage);
  }
};

/**
 * Get user profile with stats and commands
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/api/user/getFullProfile");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch profile";
    throw new Error(errorMessage);
  }
};

// ==================== COMMAND ENDPOINTS ====================

/**
 * Generate CLI command for guest users (not saved to database)
 * @param {Object} commandData - { appName, os? }
 * @returns {Promise} Generated command data
 */
export const generateGuestCommand = async (commandData) => {
  try {
    // Don't send auth token for guest requests
    const response = await axios.post(
      `${BACKEND_URL}/api/command/forGuest`,
      commandData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to generate command";
    throw new Error(errorMessage);
  }
};

/**
 * Generate CLI command for authenticated users (saved to database)
 * @param {Object} commandData - { appName, os }
 * @returns {Promise} Generated command data
 */
export const generateAuthenticatedCommand = async (commandData) => {
  try {
    const response = await apiClient.post(
      "/api/command/authenticUserCommand",
      commandData
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to generate command";
    throw new Error(errorMessage);
  }
};

/**
 * Delete a saved command
 * @param {string} commandId - Command ID to delete
 * @returns {Promise} Success message
 */
export const deleteCommand = async (commandId) => {
  try {
    const response = await apiClient.delete(`/api/command/delete/${commandId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete command";
    throw new Error(errorMessage);
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Get stored user data
 * @returns {Object|null}
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * Clear all auth data
 */
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default {
  // User endpoints
  checkApiHealth,
  registerUser,
  loginUser,
  logoutUser,
  getUserCommands,
  getUserProfile,
  
  // Command endpoints
  generateGuestCommand,
  generateAuthenticatedCommand,
  deleteCommand,
  
  // Helpers
  isAuthenticated,
  getStoredUser,
  clearAuth,
};

