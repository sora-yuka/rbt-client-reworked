import { useState, useEffect } from "react";
import { AuthContext } from "../context/auth";
import api, { registerLogoutHandler } from "../services/api";
import { tokenService } from "../utils/token";

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    const token = tokenService.getAccessToken();
    return !!token;
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    profilePhoto: localStorage.getItem("profile_photo") || null,
  });

  useEffect(() => {
    const accessToken = tokenService.getAccessToken();
    const savedPhoto = localStorage.getItem("profile_photo");

    if (isAuthorized) {
      setIsAuthorized(true);
      setUser({ profilePhoto: savedPhoto || null });
    } else {
      setIsAuthorized(false);
      setUser({ profilePhoto: null });
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("profile_photo");
    tokenService.clearTokens();
    setUser({ profilePhoto: null });
    setIsAuthorized(false);
  };

  useEffect(() => {
    registerLogoutHandler(logout);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/api/v1/users/login/", credentials);
      const { access, refresh, profile_photo } = response.data;

      tokenService.setTokens(access, refresh);

      localStorage.setItem("profile_photo", profile_photo || "");
      setUser({ profilePhoto: profile_photo || null });

      setIsAuthorized(true);
      return { success: true };
    } catch (error) {
      console.error("Authentication failed: ", error);
      return { success: false, error: error.response?.data?.detail };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthorized,
    loading,
    login,
    logout,
  };

  if (loading) {
    return <div>Loading session...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
