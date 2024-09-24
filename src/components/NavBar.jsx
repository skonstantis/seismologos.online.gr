// components/NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './navBar.module.css'; 

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <button className={styles.menuButton} onClick={toggleMenu}>
                {isMenuOpen ? 'Close Menu' : 'Open Menu'}
            </button>

            <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
                <ul>
                    <li><Link to="/">Αρχική</Link></li>
                    <li><Link to="/login">Είσοδος</Link></li>
                    <li><Link to="/register">Εγγραφή</Link></li>
                    <li><Link to="/report">Αναφορά Σεισμού</Link></li>
                </ul>
            </nav>
        </>
    );
};

export default NavBar;
