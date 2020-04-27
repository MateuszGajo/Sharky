import React from "react";

const About = ({
  userData = {
    firstName: "Jan",
    lastName: "Kowalski",
    birth: "25-03-2018",
    city: "Gorzalów",
    country: "Polska",
  },
}) => {
  return (
    <div className="about">
      <div className="about__item">
        <div className="about__item__first-column">Imię:</div>
        <div className="about__item__second-column">{userData.firstName}</div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">Nazwisko:</div>
        <div className="about__item__second-column">{userData.lastName}</div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">Miasto:</div>
        <div className="about__item__second-column">{userData.city}</div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">Kraj:</div>
        <div className="about__item__second-column">{userData.country}</div>
      </div>
      <div className="about__item">
        <div className="about__item__first-column">Urodzony:</div>
        <div className="about__item__second-column">{userData.birth}</div>
      </div>
    </div>
  );
};

export default About;
