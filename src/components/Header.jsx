import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./header.module.css";

const Header = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname !== "/";

  return (
    <nav className={styles.header}>
      <div className={styles.navLeft}>
        <Link to="/">
          <img className={styles.logo} src="../assets/logo.svg" alt="Αρχική" />
        </Link>
        <h1 className={styles.brandname}>Seismologos.gr</h1>
          <div className={styles.banner}>
            <p className={styles.bannerText}>Ζωντανά η σεισμικότητα</p>
          </div>
      </div>
      <div className={styles.navRight}>
        <ul>
          {isAuthPage && (
            <li>
              <Link to="/"><img className={styles.icons} src="../assets/home.svg" alt="Αρχική" /></Link>
            </li>
          )}
          <li>
            <Link to="/login"><p>Σύνδεση</p></Link>
          </li>
          <li>
            <Link to="/register"><p></p>Εγγραφή</Link>
          </li>
        </ul>
        <a
          href="https://x.com/seismologos"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className={styles.x} src="../assets/x.svg" alt="X" />
        </a>
      </div>
    </nav>
  );
};

export default Header;
