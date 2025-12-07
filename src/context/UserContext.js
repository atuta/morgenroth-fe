// File: context/UserContext.js
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import getLoggedInUserDetailsApi from "../api/getLoggedInUserDetailsApi";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds full user object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getLoggedInUserDetailsApi();
        // response.data.data contains the full user object
        setUser(response.data.data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used within a UserProvider");
  return context;
};
