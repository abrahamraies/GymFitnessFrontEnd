import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./AboutPage.module.css";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{t("about.header")}</h1>
      <p
        className={styles.paragraph}
        dangerouslySetInnerHTML={{ __html: t("about.intro") }}
      />
      <p className={styles.paragraph}>{t("about.mission")}</p>
      <section className={styles.section}>
        <h2 className={styles.subheader}>{t("about.whyChooseUs")}</h2>
        <ul className={styles.list}>
          {(t("about.features", { returnObjects: true }) as string[]).map((feature: string, index: number) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </section>
      <section className={styles.section}>
        <h2 className={styles.subheader}>{t("about.getInTouchHeader")}</h2>
        <p className={styles.paragraph}>{t("about.getInTouchMessage")}</p>
      </section>
    </div>
  );
};

export default AboutPage;