import MyNavbar from "components/commons/MyNavbar";
import React from "react";

const CommonLayout = ({ children }) => {
  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      <MyNavbar />
      {children}
    </div>
  );
};

export default CommonLayout;
