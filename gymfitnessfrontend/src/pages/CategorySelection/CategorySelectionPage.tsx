import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CategorySelectionPage.module.css";
import { FaArrowLeft, FaDumbbell } from 'react-icons/fa';
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
}

const CategorySelectionPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category");
        setCategories(response.data);
      } catch (err) {
        setError(t("category.error") + err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [t]);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/recommendations/${categoryId}`);
  };

  if (loading) return <div className={styles.loading}>{t("category.load")}</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("category.title")}</h1>
        <p className={styles.subtitle}>
        {t("category.description")}
        </p>
      </header>

      <section className={styles.categoryList}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={styles.categoryCard}
            onClick={() => handleCategoryClick(category.id)}
          >
            <FaDumbbell className={styles.icon} />
            {category.name}
          </button>
        ))}
      </section>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <FaArrowLeft />
        {t("general.back")}
      </button>
    </main>
  );
};

export default CategorySelectionPage;