import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  // Helper: Fetch the authenticated user (on page refresh or initial load)
  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/user/profile', {
        withCredentials: true, // Include cookies
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error.response?.data?.message || error.message);
      setUser(null);
    }
    
  };

  // Register User
  const registerUser = async (userData) => {
    setIsLoading(true);
    setIsError(null);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/user/register',
        userData,
        { withCredentials: true } // Include cookies
      );
      setUser(response.data.user); // Server sends user data in the response
    } catch (error) {
      setIsError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Login User
  const loginUser = async (credentials) => {
    setIsLoading(true);
    setIsError(null);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/user/login',
        credentials,
        { withCredentials: true } // Include cookies
      );
      setUser(response.data.user); // Server sends user data in the response
    } catch (error) {
      setIsError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout User
  const logoutUser = async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      await axios.post(
        'http://localhost:3000/api/v1/user/logout',
        {}, // Body is empty for logout
        { withCredentials: true } // Include cookies
      );
      setUser(null); // Clear user state
    } catch (error) {
      setIsError(error.response?.data?.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if a user is already logged in on component mount
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isError,
        setUser,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
