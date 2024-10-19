import React, { useState, useEffect } from "react";
import styles from "./chat.module.css";
import { useSession } from "../contexts/SessionContext";
import { Link } from "react-router-dom";

const chatBufferSize = 50;

const ChatFooter = ({ message }) => {
  return (
    <div className={styles.chatFooter}>
      <Link to="/chat-policy" className={styles.link}>
        Κανονισμός Chat
      </Link>
      <div className={styles.charCount}>{message.length}/{chatBufferSize}</div>
    </div>
  );
};

const ChatHeader = () => {
  return (
    <div className={styles.chatHeader}>
    </div>
  );
};

const ChatBody = () => {
  return (
    <div className={styles.chatBody}>
    </div>
  );
};

const ChatMessage = ({ sessionValid, setMessage }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const savedMessage = localStorage.getItem("unsentMessage");
    if (savedMessage) {
      setInputValue(savedMessage);
      setMessage(savedMessage);
    }
  }, [setMessage]);

  const sendMessage = async (message) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch("https://seismologos.onrender.com/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const result = await response.json();
      console.log("Message sent successfully", result);
      localStorage.removeItem("unsentMessage"); 
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= chatBufferSize) {
      setInputValue(value);
      setMessage(value);
      localStorage.setItem("unsentMessage", value); 
    }
  };

  return (
    <div className={styles.chatMessage}>
      <input
        type="text"
        placeholder={
          sessionValid
            ? "Πληκτρολογήστε το μήνυμα σας εδώ"
            : "Εγγραφείτε ή συνδεθείτε για να συμμετέχετε"
        }
        className={`${styles.chatInput} ${inputValue.length >= chatBufferSize ? styles.error : ""}`}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={inputValue}
        disabled={!sessionValid}
      />
    </div>
  );
};

const Chat = () => {
  const { sessionValid } = useSession();

  if (!JSON.parse(localStorage.getItem("showChat"))) {
    localStorage.setItem("showChat", false);
  }

  const [show, setShow] = useState(JSON.parse(localStorage.getItem("showChat")));
  const [message, setMessage] = useState("");

  const handleToggleShow = () => {
    const newShowStatus = !JSON.parse(localStorage.getItem("showChat"));
    localStorage.setItem("showChat", newShowStatus);
    setShow(newShowStatus);
  };

  return (
    <div className={styles.wrapper}>
      <img 
        className={`${show ? styles.showShow : styles.show}`} 
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
          <div className={styles.heading}>
            <img className={styles.chatIcon} src="../assets/chat.svg" alt="Chat" />
          </div>
          <ChatHeader />          
          <ChatBody />
          <ChatMessage sessionValid={sessionValid} setMessage={setMessage} />
          <ChatFooter message={message}/>
        </div>
      )}
    </div>
  );
};

export default Chat;
