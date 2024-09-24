import React, { useEffect } from "react";
import styles from "./errors.module.css";

const Errors = ({ errors, currentErrorIndex, setCurrentErrorIndex }) => {
  useEffect(() => {
    if (errors.length > 0) {
      setCurrentErrorIndex(0);
    } else {
      setCurrentErrorIndex(-1);
    }
  }, [errors, setCurrentErrorIndex]);

  if (errors.length === 0) return null;

  const handlePrevError = () => {
    setCurrentErrorIndex((prevIndex) =>
      prevIndex === 0 ? errors.length - 1 : prevIndex - 1
    );
  };

  const handleNextError = () => {
    setCurrentErrorIndex((prevIndex) =>
      prevIndex === errors.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.errors}>
      <h2>
        {errors.length} {errors.length !== 1 ? "Σφάλματα" : "Σφάλμα"}
      </h2>
      <div className={styles.errorNavigation}>
        {errors.length > 1 && (
          <span onClick={handlePrevError} className={styles.navArrow}>
            &lt;
          </span>
        )}
        <div className={styles.errorContainer}>
          <div className={styles.error}>{errors[currentErrorIndex]}</div>
        </div>
        {errors.length > 1 && (
          <span onClick={handleNextError} className={styles.navArrow}>
            &gt;
          </span>
        )}
      </div>
      
      <div className={styles.errorCount}>
        {currentErrorIndex + 1} / {errors.length}
      </div>
    </div>
  );
};

export default Errors;
