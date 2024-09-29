import React, { createContext, useContext, useEffect, useState } from 'react';
import { validateSession } from '../js/login/validateSession'; 

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [sessionValid, setSessionValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(""); 

  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp)); 
    
    if (isNaN(date.getTime())) {
      return null; 
    }
    
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const checkSession = async (isUpdate = false) => {
    setLoading(true);
    const isValidSession = await validateSession();
    setSessionValid(isValidSession);
    
    if (isValidSession) {
      const username = localStorage.getItem("username");
      const lastLogin = localStorage.getItem("lastLogin");
      const formattedLastLogin = formatTimestamp(lastLogin);
      
      if (!isUpdate) {
        if (formattedLastLogin) {
          setNotification(
            <div>
              Σύνδεση ως: {username}<br />
              Τελευταία σύνδεση: {formattedLastLogin}
            </div>
          );
        } else {
          setNotification(
            <div>
              Σύνδεση ως: {username}
            </div>
          );
        }
      }
    } 

    setLoading(false);

    setTimeout(() => setNotification(""), 3000);

    setTimeout(() => checkSession(true), 30 * 60 * 1000);
  };

  useEffect(() => {
    checkSession();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <SessionContext.Provider value={{ sessionValid, loading }}>
      {children} 
      {notification && <Notification message={notification} />} 
    </SessionContext.Provider>
  );
};

const Notification = ({ message }) => {
  return (
    <div style={notificationStyle}>
      {message}
    </div>
  );
};

const notificationStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'green',
    color: 'white',
    padding: '3px',
    borderRadius: '5px',
    zIndex: 1000,
    transition: 'opacity 0.5s ease-in-out',
    opacity: 0.9,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', 
    textAlign: 'center',
    lineHeight: '1.5',
    fontWeight : 'bold'
  };
  

export default SessionProvider;
