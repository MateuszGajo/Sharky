import React from "react";
import PropTypes from "prop-types";
import PrimaryButton from "@common/PrimaryButton/PrimaryButton";
import i18next from "@i18n";
const { useTranslation } = i18next;

const Authentication = ({ children, type }) => {
  const { t } = useTranslation(["component"]);

  const welcomeText = t("component:layout.authentication.welcome-text");
  const signInTitle = t("component:layout.authentication.sign-in.title");
  const signUpTitle = t("component:layout.authentication.sign-up.title");
  const signInDescription = t(
    "component:layout.authentication.sign-in.description"
  );
  const signInButtonText = t("component:layout.authentication.sign-in.button");
  const signUpDescription = t(
    "component:layout.authentication.sign-up.description"
  );
  const signUpButtonText = t("component:layout.authentication.sign-up.button");

  return (
    <section className="authentication">
      <div className="authentication__container">
        <div className="authentication__container__form">
          <h1 className="authentication__container__form__brand">
            <span className="authentication__container__form__brand--primaryColor">
              Sha
            </span>
            <span className="authentication__container__form__brand__span">
              rky
            </span>
          </h1>
          <div className="authentication__container__form__wrapper">
            <div className="authentication__container__form__wrapper__content">
              <div className="authentication__container__form__wrapper__content__title">
                <span
                  className="authentication__container__form__wrapper__content__title__span"
                  data-testid="title-auth"
                >
                  {type === "signin"
                    ? signInTitle
                    : type === "signup" && signUpTitle}
                </span>
              </div>
              {children}
            </div>
          </div>
        </div>
        <div className="authentication__container__text">
          <div className="authentication__container__text__wrapper">
            <h1 className="authentication__container__text__wrapper__title">
              {welcomeText}
            </h1>
            <p
              className="authentication__container__text__wrapper__description"
              data-testid="welcome-text"
            >
              {type === "signin"
                ? signInDescription
                : type === "signup" && signUpDescription}
            </p>
            <div className="authentication__container__text__wrapper__button">
              <PrimaryButton
                border={true}
                value={
                  type === "signin"
                    ? signInButtonText
                    : type === "signup" ? signUpButtonText : ""
                }
                link={
                  type === "signin" ? "/signup" : type === "signup" ? "/signin" : ""
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Authentication.propTypes = {
  children: PropTypes.element,
  type: PropTypes.string
}

export default Authentication ;
