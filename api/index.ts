import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// For development:
// - iOS Simulator: use "http://localhost:8000"
// - Android Emulator: use "http://10.0.2.2:8000"
// - Physical Device: use your computer's IP address (e.g., "http://192.168.1.100:8000")
const getBaseURL = () => {
  if (__DEV__) {
    // Use localhost for iOS, 10.0.2.2 for Android emulator
    return Platform.OS === "android"
      ? "http://10.0.2.2:8000"
      : "http://localhost:8000";
  }
  return "https://your-api-domain.com";
};

const baseURL = getBaseURL();
console.log(`[API] Base URL: ${baseURL} (Platform: ${Platform.OS})`);

const api: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("@auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        console.error("Authentication error:", {
          status,
          url: error.config?.url,
          message: error.response.data?.message,
        });
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error - No response from server:", {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: error.message,
        code: error.code,
      });
      console.error(
        "Make sure your backend is running on port 8000 and accessible from this device"
      );
    } else {
      // Something else happened
      console.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
