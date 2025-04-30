// src/components/Layout.js
import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [headerProps, setHeaderProps] = useState({});

  return (
    <>
      <Header {...headerProps} />
      <main>
        {/* передаем setHeaderProps всем вложенным страницам */}
        <Outlet context={{ setHeaderProps }} />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
