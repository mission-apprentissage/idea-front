import React from "react";

import Footer from "../Footer";

import "./layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <div className="App">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
