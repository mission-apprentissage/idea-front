import React from "react";

import "./layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <div className="App">{children}</div>
    </>
  );
};

export default Layout;
