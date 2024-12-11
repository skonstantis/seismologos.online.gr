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

  const [userStatuses, setUserStatuses] = useState(null); 

  const isUserRef = useRef(false);
  const authTokenRef = useRef("");
  const idRef = useRef("");
  const usernameRef = useRef("");

  const socketRef = useRef(null);

  const [activeUsers, setActiveUsers] = useState(0);
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [activeSensors, setActiveSensors] = useState(0);

  const [chatMessages, setChatMessages] = useState([]);

  const [sensorStatuses, setSensorStatuses] = useState([]);

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

  useEffect(() => {
    console.log(sensorStatuses);
  }, [sensorStatuses]);

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
      authTokenRef.current = result.token;
      localStorage.setItem("id", result.user.id);
      return {
        authToken: token,
        username: result.user.username,
        email: result.user.email,
        id: result.user.id,
        lastLogin: result.user.lastLogin,
      };
    } catch (error) {
      console.error(error);
    }
  };

  const setupSocket = (user) => {
    const url = user
      ? `wss://seismologos.onrender.com/ws/activeUsers/${user.username}?token=${user.authToken}`
      : `wss://seismologos.onrender.com/ws/activeVisitors/`;

    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      socketRef.current = newSocket;
      document.addEventListener("visibilitychange", handleVisibilityChange);
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received:", message);

      if (message?.active) {
        setActiveUsers(message.active.users);
        setActiveVisitors(message.active.visitors);
        setActiveSensors(message.active.sensors);
      }

      if (message?.userStatuses) {
        const updatedUserStatuses = message.userStatuses.map(({ lastActive, ...userStatus }) => {
          return {
            ...userStatus,
            lastActive
          };
        }).sort((a, b) => b.lastActive - a.lastActive); 
        setUserStatuses(updatedUserStatuses); 
      }

      if (message?.sensorStatuses) {
        const updatedSensorStatuses = message.sensorStatuses.map(attributes => ({
          ...attributes,
          data: 0.00  
        }));
        setSensorStatuses([
          ...sensorStatuses,
          ...updatedSensorStatuses.filter(item => !sensorStatuses.includes(item))
        ]);
      }
      

      if (message?.message) {
        setChatMessages((prevChatMessages) => [...prevChatMessages, message]);
      }

      if (message?.sensorData) {
        if (message?.credentials?.id) {
          setSensorStatuses(prevStatuses => {
            const updatedStatuses = prevStatuses.map(status => {
              if (status.id === message.credentials.id) {
                return {
                  ...status,  
                  data: message.sensorData.PGA, 
                };
              }
              return status;
            });
            return updatedStatuses;
          });
        } 
    };

    if (message?.sensorActivity) {
      if (message?.sensorActivity) {
        setSensorStatuses((prevSensorStatuses) => {
          const sensorIndex = prevSensorStatuses.findIndex(status => status.id === message.sensorActivity.which);
      
          if (message.sensorActivity.type === "con") {
            if (sensorIndex === -1) {
              return [
                ...prevSensorStatuses,
                { id: message.sensorActivity.which, active: true, data: 0.00 }
              ];
            } else {
              const updatedStatuses = [...prevSensorStatuses];
              updatedStatuses[sensorIndex] = {
                ...updatedStatuses[sensorIndex],
                active: true 
              };
              return updatedStatuses;
            }
          } else if (message.sensorActivity.type === "discon") {
            if (sensorIndex === -1) {
              return [
                ...prevSensorStatuses,
                {id: message.sensorActivity.which, active: false, data: 0.00 }
              ];
            } else {
              const updatedStatuses = [...prevSensorStatuses];
              updatedStatuses[sensorIndex] = {
                ...updatedStatuses[sensorIndex],
                active: false 
              };
              return updatedStatuses;
            }
          }
      
          return prevSensorStatuses;
        });
      }      
    }  
  };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return newSocket;
  };

  const checkSession = async (isUpdate = false) => {
    setLoading(true);
    const user = await validateSession();

    if (user) {
      setSessionValid(true);
      isUserRef.current = true;
      idRef.current = user.id;
      usernameRef.current = user.username;

      const formattedLastLogin = formatTimestamp(user.lastLogin);

      if (!isUpdate) {
        const notificationMessage = formattedLastLogin
          ? <div>Σύνδεση ως: {user.username}<br />Τελευταία σύνδεση: {formattedLastLogin}</div>
          : <div>Σύνδεση ως: {user.username}</div>;

        setTimeout(() => {
          setNotificationQueue((prevQueue) => [...prevQueue, { message: notificationMessage, color: "green" }]);
        }, 100);
      }

      socketRef.current = setupSocket(user);
    } else {
      localStorage.removeItem("unsentMessage"); 
      setSessionValid(false);
      isUserRef.current = false;
      authTokenRef.current = "";
      idRef.current = "";
      usernameRef.current = "";

      socketRef.current = setupSocket(null);
    }

    setLoading(false);
    startTimeoutRef.current = Date.now();

    if (checkSessionTimeoutIdRef.current) {
      clearTimeout(checkSessionTimeoutIdRef.current);
    }

    checkSessionTimeoutIdRef.current = setTimeout(() => checkSession(true), checkSessionTimeout);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      if (remainingTimeoutRef.current || pausedTimeoutRef.current != null) {
        const timeAway = Date.now() - pausedTimeoutRef.current;
        if (timeAway >= remainingTimeoutRef.current) checkSession();
        else {
          checkSessionTimeoutIdRef.current = setTimeout(
            () => checkSession(true),
            remainingTimeoutRef.current - timeAway
          );
          socketRef.current = setupSocket(isUserRef.current ? { authToken: authTokenRef.current,  username: usernameRef.current,  } : null);
        }
      }
    } else if (document.visibilityState === "hidden") {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      } else {
        console.log("Socket is not initialized yet.");
      }
      if (checkSessionTimeoutIdRef.current && startTimeoutRef.current != null) {
        const now = Date.now();
        clearTimeout(checkSessionTimeoutIdRef.current);
        pausedTimeoutRef.current = now;
        remainingTimeoutRef.current = startTimeoutRef.current + checkSessionTimeout - now;
      }
    }
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

    checkSession();
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (checkSessionTimeoutIdRef.current) {
        clearTimeout(checkSessionTimeoutIdRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      } else {
        console.log("Socket is not initialized yet.");
      }
    };
  }, []);

  useEffect(() => {
    //console.log("Updated userStatuses:", userStatuses);
  }, [userStatuses]);

  return (
    <SessionContext.Provider value={{
      sessionValid,
      loading,
      isUser: isUserRef.current,
      authToken: authTokenRef.current,
      id: idRef.current,
      username: usernameRef.current,
      activeUsers,
      activeVisitors,
      activeSensors,
      userStatuses,
      chatMessages,
      sensorStatuses,
      setNotification: (msg, color = "green") => setNotificationQueue((prevQueue) => [...prevQueue, { message: msg, color }])
    }}>
      {children}
      {currentNotification && <Notification message={currentNotification} color={currentColor} />}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
