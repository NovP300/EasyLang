import React, { useState, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [headerProps, setHeaderProps] = useState({});

  // создаём отдельный ref здесь
  const contactsRef = useRef(null);

  return (
    <>
      <Header {...headerProps} contactsRef={contactsRef} />
      <main>
        <Outlet context={{ setHeaderProps, contactsRef }} />
      </main>
      <Footer ref={contactsRef} />
    </>
  );
};

export default Layout;
