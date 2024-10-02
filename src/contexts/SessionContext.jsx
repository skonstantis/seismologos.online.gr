import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Notification from "../components/Notification"; 
import { formatTimestamp } from "../js/helpers/formatTimestamp"; 

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const notificationTimeout = 3 * 1000; // 3 seconds
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [currentNotification, setCurrentNotification] = useState("");
  const [currentColor, setCurrentColor] = useState("green"); 
  const [sessionValid, setSessionValid] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSessionTimeout = 30 * 60 * 1000; // 30 minutes
  const checkSessionTimeoutIdRef = useRef(null);

  useEffect(() => {
    if (notificationQueue.length > 0) {
      const { message, color } = notificationQueue[0]; 
      setCurrentNotification(message);
      setCurrentColor(color); 

      const timeoutId = setTimeout(() => {
        setCurrentNotification(""); 
        setNotificationQueue((prevQueue) => prevQueue.slice(1)); 
      }, notificationTimeout);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [notificationQueue]);

  const validateSession = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token == null) return false;

      const response = await fetch(
        "https://seismologos.onrender.com/validate/session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const result = await response.json();
      if (!response.ok) return false;

      localStorage.setItem("authToken", result.token);
      localStorage.setItem("username", result.user.username);
      localStorage.setItem("email", result.user.email);
      localStorage.setItem("id", result.user.id);
      localStorage.setItem("lastLogin", result.user.lastLogin);
      return true;
    } catch (error) {
      console.error(error);
    }
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
        const notificationMessage = formattedLastLogin
          ? <div>Σύνδεση ως: {username}<br />Τελευταία σύνδεση: {formattedLastLogin}</div>
          : <div>Σύνδεση ως: {username}</div>;

        setTimeout(() => {
          setNotificationQueue((prevQueue) => [...prevQueue, { message: notificationMessage, color: "green" }]);
        }, 100);
      }
    }

    setLoading(false);

    if (checkSessionTimeoutIdRef.current) {
      clearTimeout(checkSessionTimeoutIdRef.current);
    }

    checkSessionTimeoutIdRef.current = setTimeout(() => checkSession(true), checkSessionTimeout);
  };

  useEffect(() => {
    const storedNotification = sessionStorage.getItem("notification");
    const storedNotificationColor = sessionStorage.getItem("notificationColor");
    if (storedNotification && storedNotificationColor) {
      const notificationMessage = storedNotification; 
      setNotificationQueue((prevQueue) => [{ message: notificationMessage, color: storedNotificationColor}, ...prevQueue]);
      sessionStorage.removeItem("notification"); 
      sessionStorage.removeItem("notificationColor"); 
    }

    checkSession(); 

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (checkSessionTimeoutIdRef.current) {
        clearTimeout(checkSessionTimeoutIdRef.current);
      }
    };
  }, []);

  return (
    <SessionContext.Provider value={{ sessionValid, loading, setNotification: (msg, color = "green") => setNotificationQueue((prevQueue) => [...prevQueue, { message: msg, color }]) }}>
      {children}
      {currentNotification && <Notification message={currentNotification} color={currentColor} />}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
