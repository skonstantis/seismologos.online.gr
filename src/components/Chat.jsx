import React, { useState } from "react";
import styles from "./chat.module.css";

const ChatNav = () => {
    return (
      <div>
        {/* Chat Navigation content */}
      </div>
    );
};

const ChatBody = () => {
    return (
      <div>
        {/* Chat Body content */}
      </div>
    );
};

const Chat = () => {
  if (!JSON.parse(localStorage.getItem("showChat"))) {
    localStorage.setItem("showChat", false);
  }

  const [show, setShow] = useState(JSON.parse(localStorage.getItem("showChat")));

  const handleToggleShow = () => {
    const newShowStatus = !JSON.parse(localStorage.getItem("showChat"));
    localStorage.setItem("showChat", newShowStatus);
    setShow(newShowStatus);
  };

  return (
    <div className={styles.wrapper}>
      <img 
        className={styles.show} 
        src={show ? "../assets/collapseList.svg" : "../assets/showList.svg"} 
        alt={show ? "Hide" : "Show"} 
        onClick={handleToggleShow} 
      />
      {!show ? (
        <div className={styles.headingClosed}>
          <img className={styles.chatIcon} src="../assets/chat.svg" alt="Chat" />
        </div>
      ) : (
        <div>
          <div className={styles.heading}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chat</div>
          <ChatNav />
          <ChatBody />
        </div>
      )}
    </div>
  );
};

export default Chat;