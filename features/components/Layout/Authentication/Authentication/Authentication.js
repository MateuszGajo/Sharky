import React from "react";
import "./authentication.scss";
const Authentication = ({ children, type }) => {
  return (
    <div className="container--authentication">
      <section className="authentication">
        <div className="authentication__form">
          <h1 className="authentication__form--brand">
            <span className="authentication__form--brand--primaryColor">
              Sha
            </span>
            rky
          </h1>
          <span
            className="authentication__form--title"
            data-testid="title-auth"
          >
            {type === "signin" ? "Zaloguj się" : "Wypełnij formularz"}
          </span>
          <div className="authentication__form__wrapper">{children}</div>
        </div>
        <div className="authentication__text">
          <div className="authentication__text__wrapper">
            <h1 className="authentication__text__wrapper--title">Witaj</h1>
            <p
              className="authentication__text__wrapper--description"
              data-testid="welcome-text"
            >
              {type === "signin"
                ? "Wypełnij formularz i dołącz do naszej społecznośći"
                : "Jeżeli posiadasz już konto"}
            </p>
            <button
              className="authentication__text__wrapper--button"
              data-testid="redirect-auth-button"
            >
              {type === "signin" ? "Rejstracja" : "Zaloguj się"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Authentication;
