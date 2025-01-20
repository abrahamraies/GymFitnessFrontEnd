import React from "react";
import styles from "./AboutPage.module.css";

const AboutPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>About Gym & Fitness Guide</h1>
      <p className={styles.paragraph}>
        Welcome to <strong>Gym & Fitness Guide</strong>, your ultimate tool for discovering and customizing
        your fitness journey. Whether you're looking to train at the gym, at home, or explore new disciplines like yoga and pilates, we're here to guide you.
      </p>
      <p className={styles.paragraph}>
        Our mission is to help everyone find their perfect way to stay active and healthy by offering personalized
        recommendations, resources, and tools tailored to your preferences and goals.
      </p>
      <section className={styles.section}>
        <h2 className={styles.subheader}>Why Choose Us?</h2>
        <ul className={styles.list}>
          <li>🌟 Customized training plans for all levels.</li>
          <li>💪 Access to top resources, including YouTube channels and apps.</li>
          <li>🧘‍♂️ Options for gym training, home workouts, yoga, pilates, meditation, and more.</li>
          <li>📊 Tools to track your fitness journey and progress.</li>
        </ul>
      </section>
      <section className={styles.section}>
        <h2 className={styles.subheader}>Get in Touch</h2>
        <p className={styles.paragraph}>
          Have questions or feedback? Feel free to reach out. We'd love to hear from you!
        </p>
      </section>
    </div>
  );
};

export default AboutPage;