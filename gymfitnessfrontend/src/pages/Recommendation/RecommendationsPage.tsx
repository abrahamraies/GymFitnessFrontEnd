import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RecommendationsPage.module.css";
import axios from "axios";
import { Recommendation } from "../../interfaces/RecommendationInterface";
import { ArrowLeft, ExternalLink, Book } from 'lucide-react'
import { useTranslation } from "react-i18next";

const RecommendationsPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchRecommendations = async () => {
          try {
            const response = await axios.get(`/api/recommendations/category/${categoryId}`);
            setRecommendations(response.data);
          } catch (err) {
            setError("Failed to load recommendations. Please try again later. " + err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchRecommendations();
      }, [categoryId]);
    
      if (loading) return <div className={styles.loader}>{t("recommendations.load")}</div>
      if (error) return <div className={styles.error}>{error}</div>
      
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("recommendations.title")}</h1>
        <p className={styles.subtitle}>
        {t("recommendations.description")}
        </p>
      </header>

      <section className={styles.resourceList}>
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className={styles.resourceItem}>
            <Book className={styles.icon} />
            <h3 className={styles.resourceTitle}>{recommendation.title}</h3>
            <p className={styles.resourceDescription}>{recommendation.description}</p>
            <a href={recommendation.url} target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
            {t("recommendations.moreInfo")} <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </section>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <ArrowLeft size={20} /> {t("general.back")}
      </button>
    </main>
  );
};

export default RecommendationsPage;