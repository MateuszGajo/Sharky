import React from "react";
import PrimaryButton from "../../../common/PrimaryButton/PrimaryButton";

const authentication__container = ({ children, type }) => {
  return (
    <section className="authentication">
      <div className="authentication__container">
        <div className="authentication__container__form">
          <h1 className="authentication__container__form__brand">
            <span className="authentication__container__form__brand--primaryColor">
              Sha
            </span>
            <span className="authentication__container__form__brand--span">
              rky
            </span>
          </h1>
          <div className="authentication__container__form__wrapper">
            <div className="authentication__container__form__wrapper__content">
              <div className="authentication__container__form__wrapper__content__title">
                <span
                  className="authentication__container__form__wrapper__content__title--span"
                  data-testid="title-auth"
                >
                  {type === "signin"
                    ? "Zaloguj się"
                    : type === "signup" && "Wypełnij formularz"}
                </span>
              </div>
              {children}
            </div>
          </div>
        </div>
        <div className="authentication__container__text">
          <div className="authentication__container__text__wrapper">
            <h1 className="authentication__container__text__wrapper--title">
              Witaj
            </h1>
            <p
              className="authentication__container__text__wrapper--description"
              data-testid="welcome-text"
            >
              {type === "signin"
                ? "Wypełnij formularz i dołącz do naszej społecznośći"
                : type === "signup" && "Jeżeli posiadasz już konto"}
            </p>
            <div className="authentication__container__text__wrapper--button">
              <PrimaryButton
                border={true}
                value={
                  type === "signin"
                    ? "Rejstracja"
                    : type === "signup" && "Zaloguj się"
                }
                link={
                  type === "signin" ? "/signup" : type === "signup" && "/signin"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default authentication__container;
