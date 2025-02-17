"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any | null;
  setUser: any;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  accessToken: null,
  setAccessToken: () => {},
  refreshToken: null,
  setRefreshToken: () => {},
  isAuthenticated: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, _setAccessToken] = useState<string | null>(null);
  const [refreshToken, _setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedAccessToken) {
      _setAccessToken(storedAccessToken);
    }
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedRefreshToken) {
      _setRefreshToken(storedRefreshToken);
    }
  }, []);

  const setAccessToken = (token: string | null) => {
    _setAccessToken(token);
    if (token) {
      localStorage.setItem("accessToken", token);
      document.cookie = `accessToken=${token}; path=/; max-age=86400; secure; samesite=strict`;
    }
  };

  const setRefreshToken = (token: string | null) => {
    _setRefreshToken(token);
    if (token) {
      localStorage.setItem("refreshToken", token);
      document.cookie = `refreshToken=${token}; path=/; max-age=604800; secure; samesite=strict`;
    }
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const value = {
    user,
    setUser,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    isAuthenticated: !!accessToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
