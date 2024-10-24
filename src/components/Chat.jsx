import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./chat.module.css";
import { useSession } from "../contexts/SessionContext";
import { Link } from "react-router-dom";
import { formatElapsedTimeShort } from "../js/helpers/elapsedTime";

const chatBufferSize = 50; // chars
const scrollThreshold = 5; // px
const forceRenderTimeout = 10000; // ms

const ChatFooter = ({ message }) => {
  return (
    <div className={styles.chatFooter}>
      <Link to="/chat-policy" className={styles.link}>
        Κανονισμός Chat
      </Link>
      <div className={styles.charCount}>
        {message.length}/{chatBufferSize}
      </div>
    </div>
  );
};

const ChatHeader = () => {
  return <div className={styles.chatHeader}></div>;
};

const ChatBody = ({ chatMessages, lastSeenMessage, updateLastSeenMessage }) => {
  const chatBodyRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [, setForceRender] = useState(0);
  const messageRefs = useRef([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, forceRenderTimeout);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, isAtBottom]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxVisibleId = lastSeenMessage;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = parseInt(entry.target.getAttribute('data-id'), 10);
            if (messageId > maxVisibleId) {
              maxVisibleId = messageId;
            }
          }
        });

        if (maxVisibleId > lastSeenMessage) {
          updateLastSeenMessage(maxVisibleId);
        }
      },
      {
        root: chatBodyRef.current,
        threshold: 1.0, 
      }
    );

    messageRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => {
      messageRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, [chatMessages, lastSeenMessage, updateLastSeenMessage]);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - scrollThreshold);
  };

  return (
    <div
      className={styles.chatBody}
      onScroll={handleScroll}
      ref={chatBodyRef}
    >
      {chatMessages.map((message, index) => (
        <div
          key={index}
          className={styles.messageWrapper}
          data-id={message.id}
          ref={(el) => (messageRefs.current[index] = el)}
        >
          <div className={styles.user}>{message.user}</div>
          <div className={styles.time}>
            {formatElapsedTimeShort(Date.now() - message.time)}
          </div>
          <div className={styles.message}>{message.message}</div>
          <div className={styles.id}>{message.id}</div>
        </div>
      ))}
    </div>
  );
};

const ChatMessage = ({ sessionValid, setMessage, setNotification, token, id, username }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const savedMessage = localStorage.getItem("unsentMessage");
    if (savedMessage) {
      setInputValue(savedMessage);
      setMessage(savedMessage);
    }
  }, [setMessage]);

  const sendMessage = async (message) => {
    if (!token || !id || !username) {
      setNotification("Απαγορευμένη Δράση", "red");
      return;
    }

    try {
      const response = await fetch("https://seismologos.onrender.com/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, id, username, message }),
      });

      if (!response.ok) {
        console.error(response);
        throw new Error("Failed to send message");
      }

      localStorage.removeItem("unsentMessage");
      setInputValue("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      sendMessage(inputValue);
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
            : "Λειτουργία μόνο για Χρήστες"
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
  const { sessionValid, isUser, authToken, id, username, setNotification, chatMessages } = useSession();

  const [show, setShow] = useState(() => JSON.parse(localStorage.getItem("showChat")) || false);
  const [message, setMessage] = useState("");
  const [lastSeenMessage, setlastSeenMessage] = useState(0);

  useEffect(() => {
    const fetchlastSeenMessage = async () => {
      const savedlastSeenMessage = localStorage.getItem("lastSeenMessage");
      const parsedlastSeenMessage = parseInt(savedlastSeenMessage, 10);

      if (isNaN(parsedlastSeenMessage) || parsedlastSeenMessage < 0) {
        try {
          const response = await fetch("https://seismologos.onrender.com/chat/last", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error('Failed to fetch last message', response);
            localStorage.setItem("lastSeenMessage", "0");
            setlastSeenMessage(0);
          } else {
            const data = await response.json();
            localStorage.setItem("lastSeenMessage", data);
            setlastSeenMessage(data);
          }
        } catch (error) {
          console.error('Error fetching last message:', error);
          localStorage.setItem("lastSeenMessage", "0");
          setlastSeenMessage(0);
        }
      } else {
        setlastSeenMessage(parsedlastSeenMessage);
      }
    };

    fetchlastSeenMessage();
  }, []);

  useEffect(() => {
    localStorage.setItem("showChat", JSON.stringify(show));
  }, [show]);

  const handleToggleShow = () => {
    const newShowStatus = !show;
    localStorage.setItem("showChat", newShowStatus);
    setShow(newShowStatus);
  };

  const updateLastSeenMessage = useCallback((id) => {
    if (id >= 0) {
      setlastSeenMessage(id);
      localStorage.setItem("lastSeenMessage", id);
    }
  }, []);

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
          <ChatBody chatMessages={chatMessages} lastSeenMessage={lastSeenMessage} updateLastSeenMessage={updateLastSeenMessage} />
          {isUser ? (
            <ChatMessage sessionValid={sessionValid} setMessage={setMessage} setNotification={setNotification} token={authToken} id={id} username={username} />
          ) : (
            <ChatMessage sessionValid={sessionValid} setMessage={setMessage} token={null} id={null} username={null} />
          )}
          <ChatFooter message={message} />
        </div>
      )}
    </div>
  );
};

export default Chat;
