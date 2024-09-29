import React from 'react';
import styles from './loading.module.css'; 

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <img src={"../assets/logo.svg"} alt="Φόρτωση..." className={styles.loading} />
    </div>
  );
};

export default Loading;
