import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "https://api-scourse.sijabridge.com"; 

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized! Token might be expired.");
      await SecureStore.deleteItemAsync("jwt_token"); // Logout user
    }
    return Promise.reject(error);
  }
);

export default api;
