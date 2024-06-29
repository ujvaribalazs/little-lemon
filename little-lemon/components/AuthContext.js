// Create a file called AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [loginState, setLoginState] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchLoginState = async () => {
      try {
        const savedState = await AsyncStorage.getItem("@login");
        setLoginState(savedState === "true");
      } catch (error) {
        console.error("Failed to fetch login state:", error);
        setLoginState(false); // Default to logged out on error
      }
    };

    fetchLoginState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loginState,
        setLoginState,
        firstName,
        setFirstName,
        email,
        setEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
