import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './notFound.module.css'; 

const NotFound = () => {
  useEffect(() => {
    document.title = "404 - Δεν Βρέθηκε";
  }, []);

  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.notFoundHeading}>404 - Η σελίδα δεν βρέθηκε</h1>
      <p className={styles.notFoundMessage}>
        Συγνώμη, η σελίδα αυτή δεν υπάρχει.
      </p>
      <Link to="/" className={styles.notFoundLink}>Επιστροφή στην Αρχική</Link>
    </div>
  );
};

export default NotFound;