import React from "react";
import i18next from "@i18n";
const { useTranslation } = i18next;

const About = ({ info }) => {
  const { t } = useTranslation(["profile"]);

  const lackOfInformation = t("profile:lack-of-information");

  const { firstName, lastName, city, country, birthDate } = info;
  return (
    <div className="about">
      <div className="about__item">
        <div className="about__item__first-column">Imię:</div>
        <div className="about__item__second-column">{firstName}</div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">Nazwisko:</div>
        <div className="about__item__second-column">{lastName}</div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">Miasto:</div>
        <div className="about__item__second-column">
          {city ? city : lackOfInformation}
        </div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">Kraj:</div>
        <div className="about__item__second-column">
          {country ? country : lackOfInformation}
        </div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">Urodzony:</div>
        <div className="about__item__second-column">
          {birthDate ? birthDate : lackOfInformation}
        </div>
      </div>
    </div>
  );
};

export default About;
