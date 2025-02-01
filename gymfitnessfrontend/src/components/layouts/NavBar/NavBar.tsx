import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../../utils/context/ThemeContext';

const NavBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext)!;

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <nav className={`${styles.navbar} nav-menu`} aria-label="Main navigation">
      <div className={styles.navbarContent}>
        <h1 className={styles.logo}>
          {' '}
          <Link to="/" className={styles.navLink}>
            {' '}
            Gym & Fitness Guide{' '}
          </Link>
        </h1>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/" className={styles.navLink}>
              {t('navbar.home')}
            </Link>
          </li>
          <li>
            <Link to="/test" className={styles.navLink}>
              Test
            </Link>
          </li>
          <li>
            <Link to="/about" className={styles.navLink}>
              {t('navbar.about')}
            </Link>
          </li>
          <li>
            <button
              onClick={toggleLanguage}
              className={`${styles.languageButton} btn`}
              aria-label={t('navbar.changeLanguageAriaLabel')}
            >
              {t('navbar.changeLanguage')}
            </button>
          </li>
          <li>
            <button onClick={toggleTheme} className={styles.themeButton}>
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
