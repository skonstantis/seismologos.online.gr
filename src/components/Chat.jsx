import React, { useState } from "react";
import styles from "./chat.module.css";

const ChatNav = () => {
    
    return (
      <div>
      </div>
    );
  };

  const ChatBody = () => {
    
    return (
      <div>
      </div>
    );
  };

const Chat = () => {
  if (!JSON.parse(localStorage.getItem("showChat"))) {
    localStorage.setItem("showChat", false);
  }

  const [show, setShow] = useState(
    JSON.parse(localStorage.getItem("showChat"))
  );


  const handleToggleShow = () => {
    const newShowStatus = !JSON.parse(localStorage.getItem("showChat"));
    localStorage.setItem("showChat", newShowStatus);
    setShow(newShowStatus);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <img 
          className={styles.show} 
          src={show ? "../assets/collapseList.svg" : "../assets/showList.svg"} 
          alt={show ? "Απόκρυψη" : "Εμφάνιση"} 
          onClick={handleToggleShow} 
        />
        {!show && 
          <>
            <div className={styles.headingClosed}>
                <img className={styles.chatIcon} src="../assets/chat.svg" alt="Chat" /></div>
            <br/>
          </>
        }
        {show && (
          <div>
            <div className={styles.heading}>Chat</div>
            <ChatNav/>
            <ChatBody/>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
