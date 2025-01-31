import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useTranslation } from "react-i18next";

const NavBar: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <nav className={`${styles.navbar} nav-menu`} aria-label="Main navigation">
      <div className={styles.navbarContent}>
        <h1 className={styles.logo}>Gym & Fitness Guide</h1>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/" className={styles.navLink}>
              {t("navbar.home")}
            </Link>
          </li>
          <li>
            <Link to="/test" className={styles.navLink}>
              Test
            </Link>
          </li>
          <li>
            <Link to="/about" className={styles.navLink}>
              {t("navbar.about")}
            </Link>
          </li>
          <li>
            <button 
              onClick={toggleLanguage} 
              className={`${styles.languageButton} btn`}
              aria-label={t("navbar.changeLanguageAriaLabel")}
            >
              {t("navbar.changeLanguage")}
            </button> 
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;