import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { validateSession } from "../js/login/validateSession";

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [sessionValid, setSessionValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const timeout = 30 * 60 * 1000;
  const timeoutIdRef = useRef(null);
  const startTimeoutRef = useRef(null);
  const pausedTimeoutRef = useRef(null);
  const remainingTimeoutRef = useRef(null);

  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp));

    if (isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
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
              Σύνδεση ως: {username}
              <br />
              Τελευταία σύνδεση: {formattedLastLogin}
            </div>
          );
        } else {
          setNotification(<div>Σύνδεση ως: {username}</div>);
        }
      }
    }

    setLoading(false);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    setTimeout(() => setNotification(""), 3000);
    startTimeoutRef.current = Date.now();
    timeoutIdRef.current = setTimeout(() => checkSession(true), timeout);
  };

  useEffect(() => {
    checkSession();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (remainingTimeoutRef.current || pausedTimeoutRef.current != null) {
          const timeAway = Date.now() - pausedTimeoutRef.current;
          if (timeAway >= remainingTimeoutRef.current) checkSession();
          else
            timeoutIdRef.current = setTimeout(
              () => checkSession(true),
              remainingTimeoutRef.current - timeAway
            );
        }
      } else if (document.visibilityState === "hidden") {
        if (timeoutIdRef.current && startTimeoutRef.current != null) {
          const now = Date.now();
          clearTimeout(timeoutIdRef.current);
          pausedTimeoutRef.current = now;
          remainingTimeoutRef.current = startTimeoutRef.current + timeout - now;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
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
  return <div style={notificationStyle}>{message}</div>;
};

const notificationStyle = {
  position: "fixed",
  bottom: "25px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "green",
  color: "white",
  padding: "3px",
  borderRadius: "5px",
  fontSize: "14px",
  zIndex: 1000,
  transition: "opacity 0.5s ease-in-out",
  opacity: 0.9,
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
  textAlign: "center",
  lineHeight: "1.5",
  fontWeight: "bold",
};

export default SessionProvider;
