import React from "react";

const Main = ({ children }) => {
  return (
    <div className="home-wrapper__main">
      <div data-testid="main-content" className="home-wrapper__main__content">
        {children}
      </div>
    </div>
  );
};

export default Main;
