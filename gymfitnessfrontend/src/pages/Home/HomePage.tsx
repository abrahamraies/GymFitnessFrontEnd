import React from "react";
import styles from "./HomePage.module.css";
import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLanguage = i18n.language === "en" ? "es" : "en";
        i18n.changeLanguage(newLanguage);
      };

  return (
    <div>
      <header className={styles.header}>
        <h1>{t("welcome")}</h1>
        <p>{t("description")}</p>
        <button onClick={toggleLanguage} className={styles.button}>
          {t("changeLanguage")}
        </button>
      </header>
      <section className={styles.section}>
      <h2>{t("features")}</h2>
        <ul>
          {(t("featureList", { returnObjects: true }) as string[]).map((feature: string, index: number) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </section>
      <section className={styles.section}>
      <h2>{t("howItWorks")}</h2>
      <p>{t("instructions")}</p>
      </section>
    </div>
  );
};

export default HomePage;
