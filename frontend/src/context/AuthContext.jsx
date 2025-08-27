import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("http://216.10.243.87:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch failed:", err);
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

const login = async (idToken) => {
  try {
    const res = await axios.post("http://216.10.243.87:3000/api/auth/login", { idToken });

    if (res.data?.user && res.data?.emailVerified) {
      setUser(res.data.user);
      setToken(idToken);
      localStorage.setItem("token", idToken);
    }

    return res.data;
  } catch (err) {
    // Pass backend response back
    return err.response?.data || { message: err.message, emailVerified: false };
  }
};



  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
