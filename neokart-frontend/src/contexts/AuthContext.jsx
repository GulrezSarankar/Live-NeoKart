import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import AxiosInstance from "../api/axiosInstance";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [userToken, setUserToken] = useState(
    localStorage.getItem("userToken") || null
  );
  const [loading, setLoading] = useState(false);

  // ✅ Fetch logged-in user details
  const fetchUser = useCallback(async () => {
    if (!userToken) return;
    try {
      const response = await AxiosInstance.get("/user/me", {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("❌ Failed to fetch user:", error);
      setUser(null);
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      setUserToken(null);
    }
  }, [userToken]);

  // ✅ Run once on mount (auto fetch if token exists)
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ✅ Login user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.post("/user/login", {
        email,
        password,
      });

      const { success, role, name, token } = response.data;

      if (success && role === "USER" && token) {
        // Save token
        localStorage.setItem("userToken", token);
        setUserToken(token);

        // Save minimal user info
        const userData = { name, role };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register user
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.post("/user/register", {
        name,
        email,
        password,
      });

      return response.data.success || false;
    } catch (error) {
      console.error("❌ Registration failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, userToken, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
