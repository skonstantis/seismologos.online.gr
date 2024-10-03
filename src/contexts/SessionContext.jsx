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
  const startTimeoutRef = useRef(null);
  const pausedTimeoutRef = useRef(null);
  const remainingTimeoutRef = useRef(null);

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

    startTimeoutRef.current = Date.now();
    
    if (checkSessionTimeoutIdRef.current) {
      clearTimeout(checkSessionTimeoutIdRef.current);
    }

    checkSessionTimeoutIdRef.current = setTimeout(() => checkSession(true), checkSessionTimeout);
  };

  useEffect(() => {
    const storedNotifications = sessionStorage.getItem("notifications");
    const storedNotificationsColors = sessionStorage.getItem("notificationsColors");

    if (storedNotifications && storedNotificationsColors) {
      const notifications = JSON.parse(storedNotifications);
      const notificationsColors = JSON.parse(storedNotificationsColors);

      const notificationsQueue = notifications.map((message, index) => ({
        message,
        color: notificationsColors[index],
      }));

      setNotificationQueue((prevQueue) => [...notificationsQueue, ...prevQueue]);

      sessionStorage.removeItem("notifications"); 
      sessionStorage.removeItem("notificationsColors"); 
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (remainingTimeoutRef.current || pausedTimeoutRef.current != null) {
          const timeAway = Date.now() - pausedTimeoutRef.current;
          if (timeAway >= remainingTimeoutRef.current) checkSession();
          else
            checkSessionTimeoutIdRef.current = setTimeout(
              () => checkSession(true),
              remainingTimeoutRef.current - timeAway
            );
        }
      } else if (document.visibilityState === "hidden") {
        if (checkSessionTimeoutIdRef.current && startTimeoutRef.current != null) {
          const now = Date.now();
          clearTimeout(checkSessionTimeoutIdRef.current);
          pausedTimeoutRef.current = now;
          remainingTimeoutRef.current = startTimeoutRef.current + checkSessionTimeout - now;
        }
      }
    };
    checkSession(); 
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
