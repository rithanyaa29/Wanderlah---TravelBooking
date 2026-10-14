import { createContext, useContext, useState } from "react";
import {
  signupTraveler,
  loginTraveler
} from "../api/api";

const CURRENT_USER_KEY = "wanderlahCurrentUser";
const TOKEN_KEY = "wanderlahToken";

const readCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
  } catch {
    return null;
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(readCurrentUser);
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY)
  );

  // REGISTER A NEW TRAVELER
  const signup = async ({ username, email, password }) => {
    if (!username?.trim() || !email?.trim() || !password) {
      return {
        success: false,
        message: "Please fill all fields."
      };
    }

    try {
      await signupTraveler({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      return {
        success: true,
        message: "Registration successful. Please log in."
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to register. Please try again."
      };
    }
  };

  // LOG IN A TRAVELER
  const login = async ({ identifier, password }) => {
    if (!identifier?.trim() || !password) {
      return {
        success: false,
        message: "Enter your username/email and password."
      };
    }

    try {
      const data = await loginTraveler({
        identifier: identifier.trim(),
        password
      });

      // Save the JWT token and safe user information
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setCurrentUser(data.user);

      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Please try again."
      };
    }
  };

  // LOG OUT THE TRAVELER
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);

    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token,
    isLoggedIn: Boolean(currentUser && token),
    hasRegisteredUsers: false,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}