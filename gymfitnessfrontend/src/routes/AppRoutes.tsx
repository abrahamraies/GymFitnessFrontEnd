import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AboutPage from '../pages/about/AboutPage';
import HomePage from '../pages/Home/HomePage';
import TestPage from '../pages/TestPages/TestPage';
import CategorySelectionPage from '../pages/CategorySelection/CategorySelectionPage';
import RecommendationsPage from '../pages/Recommendation/RecommendationsPage';
import TestComponent from '../pages/TestPages/TestComponent';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <AboutPage />
            </MainLayout>
          }
        />
        <Route
          path="/test"
          element={
            <MainLayout>
              <TestPage />
            </MainLayout>
          }
        />
        <Route
          path="/test/start"
          element={
            <MainLayout>
              <TestComponent />
            </MainLayout>
          }
        />
        <Route
          path="/test/categories"
          element={
            <MainLayout>
              <CategorySelectionPage />
            </MainLayout>
          }
        />
        <Route
          path="/recommendations/:categoryId"
          element={
            <MainLayout>
              <RecommendationsPage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
