import React from "react";
import i18next from "@i18n";
const { useTranslation } = i18next;

const About = ({ info }) => {
  const { t } = useTranslation(["profile"]);

  const lackOfInformation = t("profile:lack-of-information");
  const firstNameText = t("profile:about.first-name");
  const lastNameText = t("profile:about.last-name");
  const cityText = t("profile:about.city");
  const countryText = t("profile:about.country");
  const birthdateText = t("profile:about.birthdate");

  const { firstName, lastName, city, country, birthDate } = info;
  return (
    <div className="about">
      <div className="about__item">
        <div className="about__item__first-column">{firstNameText}:</div>
        <div className="about__item__second-column">{firstName}</div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">{lastNameText}:</div>
        <div className="about__item__second-column">{lastName}</div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">{cityText}:</div>
        <div className="about__item__second-column">
          {city ? city : lackOfInformation}
        </div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">{countryText}:</div>
        <div className="about__item__second-column">
          {country ? country : lackOfInformation}
        </div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">{birthdateText}:</div>
        <div className="about__item__second-column">
          {birthDate ? birthDate : lackOfInformation}
        </div>
      </div>
    </div>
  );
};

export default About;
