import React, { useState, useEffect } from "react";
import styles from "./loading.module.css";

const Loading = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        switch (prevDots.length) {
          case 0:
            return ".";
          case 1:
            return "..";
          case 2:
            return "...";
          case 3:
            return "";
          default:
            return "";
        }
      });
    }, 100); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <img
        src={"../assets/logo.svg"}
        alt="Φόρτωση..."
        className={styles.loading}
      />
      <div className={styles.wrapper}>
        Φόρτωση<span className={styles.dots}>{dots}</span>
      </div>
    </div>
  );
};

export default Loading;
