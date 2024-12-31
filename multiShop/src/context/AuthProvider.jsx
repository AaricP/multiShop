import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await axios.get("http://localhost:3000/admin");
      const adminData = response.data.admin;

      if (username === adminData.username && password === adminData.password) {
        setUser({ username });
        navigate("/admin");
        return { success: true };
      } else {
        return { success: false, error: "Invalid Credentials" };
      }
    } catch (error) {
      return { success: false, error: "An error occurred while logging in." };
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
