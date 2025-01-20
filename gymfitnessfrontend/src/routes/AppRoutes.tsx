import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import AboutPage from "../pages/about/AboutPage";
import HomePage from "../pages/Home/HomePage";

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
      </Routes>
      </Router>
    );
  };
  
  export default AppRoutes;