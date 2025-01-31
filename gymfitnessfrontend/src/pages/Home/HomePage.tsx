import React from "react";
import styles from "./HomePage.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaDumbbell, FaClipboardList, FaChartLine } from 'react-icons/fa';

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleStartTest = () => {
      navigate("/test/start");
    };

    return (
      <main className={styles.container}> 
        <header className={styles.header}>
          <h1>{t("home.welcome")}</h1>
          <p className={styles.subtitle}>{t("home.description")}</p>
        </header>

        <section className={styles.howItWorksSection}>
          <h2>{t("home.howItWorks")}</h2>
          <p>{t("home.instructions")}</p>
          <div className={styles.buttonContainer}>
            <button className={styles.startTestButton} onClick={handleStartTest}>
              {t("home.startTest")}
            </button>
          </div>
        </section>
  
        <section className={styles.featureSection}>
          <h2>{t("home.features")}</h2>
          <div className={styles.featureList}>
            {(t("home.featureList", { returnObjects: true }) as string[]).map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                {index === 0 && <FaDumbbell className={styles.featureIcon} />}
                {index === 1 && <FaClipboardList className={styles.featureIcon} />}
                {index === 2 && <FaChartLine className={styles.featureIcon} />}
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
};

export default HomePage;