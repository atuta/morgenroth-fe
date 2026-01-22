import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // Ref to hold the ID of the setTimeout
  const timeoutRef = useRef(null);

  // 7 minutes in milliseconds
  const INACTIVITY_LIMIT = 7 * 60 * 1000;

  const logout = useCallback(() => {
    // Clear the timer if it's running
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Force redirect to sign-in
    window.location.replace("/authentication/sign-in");
  }, []);

  const resetTimer = useCallback(() => {
    // 1. Clear existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // 2. Set new timeout only if user is authenticated
    if (user) {
      timeoutRef.current = setTimeout(() => {
        console.log("Inactivity detected. Logging out...");
        logout();
      }, INACTIVITY_LIMIT);
    }
  }, [user, logout, INACTIVITY_LIMIT]);

  useEffect(() => {
    // Define the interaction events to watch
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    if (user) {
      // Start the initial timer
      resetTimer();

      // Attach listeners to the window
      events.forEach((event) => window.addEventListener(event, resetTimer));
    }

    // Cleanup: Remove listeners and clear timeout when user logs out or component unmounts
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user, resetTimer]);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used within a UserProvider");
  return context;
};
