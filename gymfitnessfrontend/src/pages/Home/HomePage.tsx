import React from 'react';
import styles from './HomePage.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaDumbbell, FaClipboardList, FaChartLine } from 'react-icons/fa';
import FeatureItem from '../../components/FeatureItem/FeatureItem';
import Button from '@mui/material/Button';

const featuresData = [
  {
    id: 'personalized',
    textKey: 'home.featureList.0',
    IconComponent: FaDumbbell,
  },
  {
    id: 'progress',
    textKey: 'home.featureList.1',
    IconComponent: FaClipboardList,
  },
  {
    id: 'adaptive',
    textKey: 'home.featureList.2',
    IconComponent: FaChartLine,
  },
];

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/test/start');
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>{t('home.welcome')}</h1>
        <p className={styles.subtitle}>{t('home.description')}</p>
      </header>

      <section className={styles.howItWorksSection}>
        <h2>{t('home.howItWorks')}</h2>
        <p>{t('home.instructions')}</p>
        <div className={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartTest}
          >
            {t('home.startTest')}
          </Button>
        </div>
      </section>

      <section className={styles.featureSection}>
        <h2>{t('home.features')}</h2>
        <div className={styles.featureList}>
          {featuresData.map((feature) => (
            <FeatureItem
              key={feature.id}
              Icon={feature.IconComponent}
              text={t(feature.textKey)}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
