import React from "react";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <NavBar />
      <main style={{ padding: "20px", minHeight: "80vh" }}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;