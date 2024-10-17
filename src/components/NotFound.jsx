import React from "react";
import { useEffect } from "react";
import styles from "./notFound.module.css"; 

const NotFound = () => {
  useEffect(() => {
    document.title = "404 - Η σελίδα δεν υπάρχει";
  }, []);

  return (
    <div className={styles.notFoundContainer}>
      <p className={styles.notFoundHeading}>Σφάλμα 404</p>
      <p className={styles.notFoundMessage}>
        Η σελίδα αυτή δεν υπάρχει, ή έχει μετακινηθεί.
      </p>      
      <p className={styles.notFoundMessage}>
        Χρησιμοποιήστε το μενού για να βρείτε αυτό που ψάχνετε.
      </p>
    </div>
  );
};

export default NotFound;