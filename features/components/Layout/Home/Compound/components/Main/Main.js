import React from "react";

const Main = ({ children }) => {
  return (
    <div className="home__main">
      <div data-testid="main-content" className="home__main__content">
        {children}
      </div>
    </div>
  );
};

export default Main;
