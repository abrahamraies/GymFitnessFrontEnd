import React from "react";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  return (
    <div>
      <header className={styles.header}>
        <h1>Welcome to Gym & Fitness Guide</h1>
        <p>Your ultimate guide to achieving your fitness goals.</p>
      </header>
      <section className={styles.section}>
        <h2>Features</h2>
        <ul>
          <li>Personalized workout recommendations</li>
          <li>Access to fitness resources and guides</li>
          <li>Tools to track your progress</li>
          <li>Community support</li>
        </ul>
      </section>
      <section className={styles.section}>
        <h2>How it Works</h2>
        <p>
          Take a quick fitness test to discover the best workout plan for you. Whether you
          prefer working out at the gym, at home, or exploring yoga and meditation, we have
          everything you need.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
