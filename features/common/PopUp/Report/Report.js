import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import PrimaryButton from "@common/PrimaryButton/PrimaryButton";
import i18next from "@i18n";
import AppContext from "@features/context/AppContext";
const { useTranslation } = i18next;

const Report = ({ type = "post", id }) => {
  const { t } = useTranslation();

  const title = t(`common:pop-up.report.title-${type}`);
  const subtitle = t("common:pop-up.report.subtitle");
  const offensiveContent = t("common:pop-up.report.select.offensive-content");
  const spam = t("common:pop-up.report.select.spam");
  const buttonText = t("common:pop-up.report.button");

  const { setReport } = useContext(AppContext);

  const [reportsList, setReportsLists] = useState([]);

  const items = [
    {
      name: "offensive content",
      value: offensiveContent,
    },
    {
      name: "spam",
      value: spam,
    },
  ];

  const handleClick = (e, reason) => {
    e.preventDefault();
    const { classList } = e.currentTarget;

    if (classList.contains("primary-background")) {
      classList.remove("primary-background");
      const newReportsList = reportsList.filter((item) => item != reason);

      setReportsLists(newReportsList);
    } else {
      classList.add("primary-background");
      setReportsLists([...reportsList, reason]);
    }
  };

  return (
    <section className="report-user">
      <div className="report-user__container">
        <div className="report-user__container__title">
          <h2 className="report-user__container__title__h2">{title}</h2>
        </div>
        <div className="report-user__container__content">
          <div className="report-user__container__content__subtitle">
            <h3 className="report-user__container__content__subtitle__h3">
              {subtitle}:
            </h3>
          </div>
          <div className="report-user__container__content__select">
            {items.map((item, i) => {
              const { value, name } = item;

              return (
                <div
                  className="report-user__container__content__select__item"
                  key={i}
                >
                  <div
                    className="report-user__container__content__select__item__circle"
                    data-id={i}
                    onClick={(e) => handleClick(e, name)}
                  >
                    <span className="report-user__container__content__select__item__circle__span">
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="report-user__container__button"
          onClick={() => {
            setReport({ type: "", id: "" });
          }}
        >
          <PrimaryButton value={buttonText} size="medium" />
        </div>
      </div>
    </section>
  );
};

Report.propTypes = {
  type: PropTypes.string,
  id: PropTypes.number,
};

export default Report;
