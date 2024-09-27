import React from "react";
import { Link } from "react-router-dom";
import styles from "./footer.module.css";

const Footer = () => {
  const getCurrentYear = () => {
    const options = { timeZone: 'Europe/Athens', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
  };

  return (
    <div className={styles.footer}>
      <div className={styles.linksContainer}>
        <a href="/privacy-policy" className={styles.link} target="_blank" rel="noopener noreferrer">Απόρρητο</a>
        <span>|</span>
        <a href="/terms-of-service" className={styles.link} target="_blank" rel="noopener noreferrer">Όροι</a>
        <span>|</span>
        <a href="/faq" className={styles.link} target="_blank" rel="noopener noreferrer">FAQ</a>
        <span>|</span>
        <a href="/contact-us" className={styles.link} target="_blank" rel="noopener noreferrer">Επικοινωνία</a>
      </div>
      <span className={styles.copyRight}>&copy; {getCurrentYear()}</span>
    </div>
  );
};

export default Footer;
