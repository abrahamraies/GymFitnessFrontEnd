import React from 'react';
import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  Icon: React.ElementType;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ Icon, text }) => {
  return (
    <div className={styles.featureItem}>
      <Icon className={styles.featureIcon} aria-hidden="true" />
      <p className={styles.featureText}>{text}</p>
    </div>
  );
};

export default FeatureItem;
