import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import { formatNumber } from "../js/helpers/formatNumber";
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
    <li className={styles.navItem}>
      <Link to="/login" className={styles.link}>
        <p className={styles.linkText}>Σύνδεση</p>
      </Link>
    </li>
    {/* <li className={styles.navItem}>
      <Link to="/register" className={styles.link}>
        <p className={styles.linkText}>Εγγραφή</p>
      </Link>
    </li> */}
  </>
);

const LoggedInLinks = () => (
  <li className={styles.navItem}>
    <Link to="/profile" className={styles.link}>
      <img className={styles.profileIcon} src="../assets/profile.svg" alt="Προφίλ" />
    </Link>
    <Link to="/logout" className={styles.link}>
      <img className={styles.logoutIcon} src="../assets/logout.svg" alt="Αποσύνδεση" />
    </Link>
  </li>
);

const HomeLink = () => (
  <li>
    <Link to="/">
      <img className={styles.icons} src="../assets/home.svg" alt="Αρχική" />
    </Link>
  </li>
);

const ActiveUsers = ({ activeUsers }) => (
  <li className={styles.navItem}>
    <img className={styles.activeIcons} src="../assets/activeUsers.svg" alt="Συνδεδεμένοι Χρήστες" />
    <span className={styles.activeCount}>{activeUsers}</span>
  </li>
);

const ActiveVisitors = ({ activeVisitors }) => (
  <li className={styles.navItem}>
    <img className={styles.activeIcons} src="../assets/activeVisitors.svg" alt="Ενεργοί Επισκέπτες" />
    <span className={styles.activeCount}>{activeVisitors}</span>
  </li>
);

const ActiveSensors = ({ activeSensors }) => (
  <li className={styles.navItem}>
    <img className={styles.activeIcons} src="../assets/activeSensors.svg" alt="Ενεργοί Σταθμοί" />
    <span className={styles.activeCount}>{activeSensors}</span>
  </li>
);

const Header = () => {
  const location = useLocation();
  const { sessionValid, loading, activeUsers, activeVisitors, activeSensors } = useSession();
  const isAuthPage = location.pathname !== "/";

  if (loading) {
    return null;
  }

  return (
    <nav className={styles.header}>
      <LogoAndBrand />
      <div className={styles.navRight}>
        <ul className={styles.navList}>
          <ActiveSensors activeSensors={formatNumber(activeSensors)} />
          <ActiveVisitors activeVisitors={formatNumber(activeVisitors)} />
          <ActiveUsers activeUsers={formatNumber(activeUsers)} />
          {isAuthPage && <HomeLink />}
          {!loading && !sessionValid && <AuthLinks />}
          {!loading && sessionValid && <LoggedInLinks />}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
