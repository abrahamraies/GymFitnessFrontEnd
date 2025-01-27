import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RecommendationsPage.module.css";
import axios from "axios";
import { Recommendation } from "../../interfaces/RecommendationInterface";

const RecommendationsPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
    
      if (loading) return <p>Loading recommendations...</p>;
      if (error) return <p className={styles.error}>{error}</p>;
      
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Recommendations</h1>
        <p className={styles.subtitle}>
          Here are some suggestions for your chosen category:
        </p>
      </header>

      <section className={styles.resourceList}>
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className={styles.resourceItem}>
            <h3>{recommendation.title}</h3>
            <p>{recommendation.description}</p>
            <a href={recommendation.url} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </div>
        ))}
      </section>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Back
      </button>
    </main>
  );
};

export default RecommendationsPage;
