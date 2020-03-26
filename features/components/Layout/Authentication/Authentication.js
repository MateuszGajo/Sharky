import React from "react";
import "./authentication.scss";
const Authentication = ({ children }) => {
  return (
    <div className="container--authentication">
      <section className="authentication">
        <div className="authentication__form">
          <h1 className="authentication__form--brand">
            <span>Sha</span>rky
          </h1>
          <span className="authentication__form--title">Zaloguj się</span>
          <div className="authentication__form__wrapper">{children}</div>
        </div>
        <div className="authentication__text">
          <div className="authentication__text__wrapper">
            <h1 className="authentication__text__wrapper--title">Witaj</h1>
            <p className="authentication__text__wrapper--description">
              Wypełnij formularz i dołącz do naszej społecznośći
            </p>
            <button className="authentication__text__wrapper--button">
              Rejstracja
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Authentication;
