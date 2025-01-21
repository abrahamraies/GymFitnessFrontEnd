import React from "react";
import styles from "./HomePage.module.css";
import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {
    const { t } = useTranslation();

      return (
        <main className={styles.container}> 
          <header className={styles.header}>
            <h1>{t("home.welcome")}</h1>
            <p>{t("home.description")}</p>
          </header>
    
          <section className={styles.featureSection}>
            <h2>{t("home.features")}</h2>
            <ul>
              {(t("home.featureList", { returnObjects: true }) as string[]).map((feature, index) => (
                <li key={index} style={{ listStylePosition: 'inside' }}>{feature}</li>
              ))}
            </ul>
          </section>
    
          <section className={styles.howItWorksSection}>
            <h2>{t("home.howItWorks")}</h2>
            <p>{t("home.instructions")}</p>
          </section>
        </main>
      );
    };

export default HomePage;
