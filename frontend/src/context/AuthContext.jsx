import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { setUserOnlineStatus } from "utils/firebaseChatHelper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);


  const fetchProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${apiUrl}/auth/me`, {
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
  }, [token, apiUrl]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!user?._id) return;

    setUserOnlineStatus(user._id);

    const interval = setInterval(() => {
      setUserOnlineStatus(user._id);
    }, 30000);

    return () => clearInterval(interval);
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    const handleVisibility = () => {
      setUserOnlineStatus(user._id);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleVisibility);
    };
  }, [user?._id]);



  const login = async (idToken) => {
    try {
      const res = await axios.post(`${apiUrl}auth/login`, { idToken });

          if (res.data?.emailVerified === false) {
      return { emailVerified: false, message: res.data.message };
    }

        if (res.data?.inactive) {
      return { inactive: true, message: res.data.message };
    }

      if (res.data?.user) {
        setUser(res.data.user);
        setToken(idToken);
        localStorage.setItem("token", idToken);
        setUserOnlineStatus(res.data.user._id);
      }

      return res.data;
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data || {};
      const message = data.message || "Login failed. Please try again.";

      if (status === 400 && message === "Email already exists") {
        return { error: true, message: "Email already exists" };
      }

      if (status === 403 && data.inactive) {
        return { inactive: true, message: data.message };
      }

      if (status === 401) {
        return { error: true, message: "Invalid or expired token" };
      }

      if (status === 403 && data.emailVerified === false) {
        return { emailVerified: false, message: data.message };
      }

      return { error: true, message };
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
