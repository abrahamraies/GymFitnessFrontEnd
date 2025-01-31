import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TestPage.module.css";
import { useTranslation } from "react-i18next";
import { FaPlay, FaUser } from 'react-icons/fa';

const TestPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate("/test/start");
  };

  const handleProfileSelection = () => {
    navigate("/test/categories");
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>{t("test.welcome")}</h1>
        <p className={styles.subtitle}>
          {t("test.description")}
        </p>
      </header>

      <div className={styles.buttonContainer}>
        <button className={`${styles.button} ${styles.startButton}`} onClick={handleStartTest}>
          <FaPlay className={styles.icon} />
          {t("test.startTest")}
        </button>
        <button className={`${styles.button} ${styles.profileButton}`} onClick={handleProfileSelection}>
          <FaUser className={styles.icon} />
          {t("test.knowProfile")}
        </button>
      </div>
    </main>
  );
};

export default TestPage;