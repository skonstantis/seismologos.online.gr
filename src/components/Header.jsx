import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../contexts/SessionContext"; 
import styles from "./header.module.css";

const LogoAndBrand = () => (
  <div className={styles.navLeft}>
    <Link to="/">
      <img className={styles.logo} src="../assets/logo.svg" alt="Αρχική" />
    </Link>
    <h1 className={styles.brandname}>Seismologos.gr</h1>
    <div className={styles.banner}>
      <p className={styles.bannerText}>Ζωντανά η σεισμικότητα</p>
    </div>
  </div>
);

const AuthLinks = () => (
  <>
    <li>
      <Link to="/login">
        <p>Σύνδεση</p>
      </Link>
    </li>
    <li>
      <Link to="/register">
        <p>Εγγραφή</p>
      </Link>
    </li>
  </>
);

const HomeLink = () => (
  <li>
    <Link to="/">
      <img className={styles.icons} src="../assets/home.svg" alt="Αρχική" />
    </Link>
  </li>
);

const SocialLink = () => (
  <a
    href="https://x.com/seismologos"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img className={styles.x} src="../assets/x.svg" alt="X" />
  </a>
);

const Header = () => {
  const location = useLocation();
  const { sessionValid, loading } = useSession();
  const isAuthPage = location.pathname !== "/";

  if (loading) {
    return null; 
  }

  return (
    <nav className={styles.header}>
      <LogoAndBrand />
      <div className={styles.navRight}>
        <ul>
          {isAuthPage && <HomeLink />}
          {!loading && !sessionValid && <AuthLinks />}
        </ul>
        <SocialLink />
      </div>
    </nav>
  );
};

export default Header;
