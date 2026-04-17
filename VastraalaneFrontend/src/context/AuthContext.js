import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

const AuthContext = createContext();

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(token));

  const persistAuth = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    persistAuth("", null);
  };

  const refreshProfile = async (explicitToken) => {
    const authToken = explicitToken || token || localStorage.getItem(TOKEN_KEY);
    if (!authToken) {
      setLoading(false);
      return null;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${config.API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const nextUser = res.data || null;
      setToken(authToken);
      setUser(nextUser);
      persistAuth(authToken, nextUser);
      return nextUser;
    } catch (error) {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (nextToken, providedUser = null) => {
    setToken(nextToken);

    if (providedUser) {
      setUser(providedUser);
      persistAuth(nextToken, providedUser);
      return providedUser;
    }

    persistAuth(nextToken, user);
    return refreshProfile(nextToken);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    refreshProfile(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = {
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    refreshProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
