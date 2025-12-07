import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import getLoggedInUserDetailsApi from "../api/getLoggedInUserDetailsApi"; // <- corrected path

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, status } = await getLoggedInUserDetailsApi();
        if (status === 200) {
          setUser(data);
        } else {
          console.error("[UserContext] Failed to fetch user details:", data);
          setUser(null);
        }
      } catch (error) {
        console.error("[UserContext] Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser, loading }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
