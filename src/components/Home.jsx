import React, { useEffect, useState } from "react";
import styles from "./home.module.css";
import ActiveUsers from "./ActiveUsers";
import Chat from "./Chat";
import ActiveSensors from "./ActiveSensors";

const Home = () => {
  useEffect(() => {
    document.title = "Αρχική - Σεισμοί τώρα στην Ελλάδα";
  }, []);

  const [showActiveUsers, setShowActiveUsers] = useState(
    JSON.parse(localStorage.getItem("showActiveUsers"))
  );

  const [showActiveSensors, setShowActiveSensors] = useState(
    JSON.parse(localStorage.getItem("showActiveSensors"))
  );

  const [showChat, setShowChat] = useState(() => {
    const savedValue = localStorage.getItem("showChat");
    return savedValue === "true";
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <ActiveUsers
        showActiveUsers={showActiveUsers}
        setShowActiveUsers={setShowActiveUsers}
        showActiveSensors={showActiveSensors}
        setShowActiveSensors={setShowActiveSensors}
        windowWidth={windowWidth}  
      />
      <Chat
        showChat={showChat}
        setShowChat={setShowChat}
        showActiveUsers={showActiveUsers}
        showActiveSensors={showActiveSensors}
        windowWidth={windowWidth}  
      />
      <ActiveSensors 
        showActiveSensors={showActiveSensors}
        setShowActiveSensors={setShowActiveSensors}
        showActiveUsers={showActiveUsers}
        setShowActiveUsers={setShowActiveUsers} 
        windowWidth={windowWidth}  
      />
    </div>
  );
};

export default Home;
