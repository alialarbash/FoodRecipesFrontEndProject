/**
 * Authentication API service
 */

import api from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

/**
 * Authentication API calls
 */
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<LoginResponse>("/users/login", {
        email: credentials.email,
        password: credentials.password,
      });

      // Store token in AsyncStorage
      if (response.data.token) {
        await AsyncStorage.setItem("@auth_token", response.data.token);
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle network errors specifically
      if (error.code === "ECONNABORTED" || error.message === "Network Error") {
        return {
          success: false,
          message:
            "Cannot connect to server. Make sure your backend is running on port 8000.",
        };
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  signUp: async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      formData.append("name", credentials.name);
      formData.append("email", credentials.email);
      formData.append("password", credentials.password);

      // Append image if provided
      if (credentials.image) {
        // Extract filename from URI
        const filename = credentials.image.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("image", {
          uri: credentials.image,
          name: filename,
          type: type,
        } as any);
      }

      const response = await api.post<RegisterResponse>(
        "/users/register",
        formData
        // Don't set Content-Type header - axios will set it automatically with boundary for FormData
      );

      // Store token in AsyncStorage
      if (response.data.token) {
        await AsyncStorage.setItem("@auth_token", response.data.token);
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("Sign up error:", error);

      // Handle network errors specifically
      if (error.code === "ECONNABORTED" || error.message === "Network Error") {
        return {
          success: false,
          message:
            "Cannot connect to server. Make sure your backend is running on port 8000.",
        };
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      return {
        success: false,
        message: errorMessage,
      };
    }
  },
};
