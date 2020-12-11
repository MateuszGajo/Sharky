import React from "react";
import PropTypes from "prop-types";
import i18next from "~i18n";

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
        <div className="about__item__first-column">{`${firstNameText} :`}</div>
        <div className="about__item__second-column">{firstName}</div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">{`${lastNameText} :`}</div>
        <div className="about__item__second-column">{lastName}</div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">{`${cityText}} :`}</div>
        <div className="about__item__second-column">
          {city || lackOfInformation}
        </div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">{`${countryText} :`}</div>
        <div className="about__item__second-column">
          {country || lackOfInformation}
        </div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">{`${birthdateText} :`}</div>
        <div className="about__item__second-column">
          {birthDate || lackOfInformation}
        </div>
      </div>
    </div>
  );
};

About.propTypes = {
  info: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    birthDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default About;
