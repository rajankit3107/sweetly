import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Define a type for the JWT payload
interface JwtPayload {
  role?: string;
  [key: string]: unknown;
}

interface Auth {
  token: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<Auth>({
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  useEffect(() => {
    if (token) {
      try {
        const payload: JwtPayload = jwtDecode(token);
        setRole(payload.role || null);
        localStorage.setItem("role", payload.role || "");
      } catch {
        setRole(null);
      }
    }
  }, [token]);

  const login = (t: string) => {
    setToken(t);
    localStorage.setItem("token", t);
    try {
      const payload: JwtPayload = jwtDecode(t);
      setRole(payload.role || null);
      localStorage.setItem("role", payload.role || "");
    } catch {
      setRole(null);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth is now in its own file: useAuth.tsx
export default AuthContext;
