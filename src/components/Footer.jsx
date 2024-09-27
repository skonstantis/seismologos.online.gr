import React from "react";
import { Link } from "react-router-dom";
import styles from "./footer.module.css";

const Footer = () => {
  const getCurrentYear = () => {
    const options = { timeZone: "Europe/Athens", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date());
  };

  return (
    <div className={styles.footer}>
      <div className={styles.linksContainer}>
        <Link to="/privacy-policy" className={styles.link}>
          Απόρρητο
        </Link>
        <span>|</span>

        <Link to="/terms-of-service" className={styles.link}>
          Όροι
        </Link>
        <span>|</span>

        <Link to="/faq" className={styles.link}>
          FAQ
        </Link>
        <span>|</span>

        <Link to="/contact-us" className={styles.link}>
          Επικοινωνία
        </Link>
      </div>
      <span className={styles.copyRight}>&copy; {getCurrentYear()}</span>
    </div>
  );
};

export default Footer;
