import React, { createContext, useContext, useEffect, useState } from 'react';
import { validateSession } from '../js/login/validateSession'; 

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [sessionValid, setSessionValid] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    setLoading(true);
    const isValidSession = await validateSession();
    setSessionValid(isValidSession);    
    setLoading(false);

    setTimeout(checkSession, 30 * 60 * 1000);
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
    </SessionContext.Provider>
  );
};
