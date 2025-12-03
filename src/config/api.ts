/**
 * API Configuration
 */

// For development:
// - iOS Simulator: use "http://localhost:8000"
// - Android Emulator: use "http://10.0.2.2:8000"
// - Physical Device: use your computer's IP address (e.g., "http://192.168.1.100:8000")
// For production, replace with your actual API URL
export const API_BASE_URL = __DEV__
  ? "http://localhost:8000"
  : "https://your-api-domain.com";

export const API_ENDPOINTS = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
};
