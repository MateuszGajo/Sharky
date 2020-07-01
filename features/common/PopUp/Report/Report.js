import React, { useRef, useEffect } from "react";
import PrimaryButton from "../../PrimaryButton/PrimaryButton";
import i18next from "../../../../i18n";
const { useTranslation } = i18next;

const Report = ({ type = "post", setStatusOfReport }) => {
  const { t } = useTranslation();
  const title = t(`common:pop-up.report.title-${type}`);
  const subtitle = t("common:pop-up.report.subtitle");
  const selectOffensiveContent = t(
    "common:pop-up.report.select.offensive-content"
  );
  const selectSpam = t("common:pop-up.report.select.spam");
  const buttonText = t("common:pop-up.report.button");

  const selectItems = [selectOffensiveContent, selectSpam];

  const reportItems = {
    0: {
      name: selectOffensiveContent,
    },
    1: {
      name: selectSpam,
    },
  };

  const selectItemsRef = useRef(
    Array.from({ length: selectItems.length }, () => React.createRef())
  );

  useEffect(() => {
    selectItemsRef.current.forEach(({ current: item }) => {
      item.addEventListener("click", () => {
        item.classList.toggle("primary-background");
      });
    });
  }, []);

  const reportSend = () => {
    const reportList = [];
    selectItemsRef.current.forEach(({ current: item }) => {
      if (item.classList.contains("primary-background")) {
        reportList.push(reportItems[item.dataset.id].name);
      }
    });
  };
  return (
    <section className="report-user">
      <div className="report-user__container">
        <div className="report-user__container__title">
          <h2 className="report-user__container__title--h2">{title}</h2>
        </div>
        <div className="report-user__container__content">
          <div className="report-user__container__content__subtitle">
            <h3 className="report-user__container__content__subtitle--h3">
              {subtitle}:
            </h3>
          </div>
          <div className="report-user__container__content__select">
            {Object.entries(reportItems).map(([i, item]) => (
              <div
                className="report-user__container__content__select__item"
                key={i}
              >
                <div
                  className="report-user__container__content__select__item__circle"
                  ref={selectItemsRef.current[i]}
                  data-id={i}
                >
                  <span className="report-user__container__content__select__item__circle--span">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="report-user__container__button"
          onClick={() => {
            reportSend();
            setStatusOfReport(false);
          }}
        >
          <PrimaryButton value={buttonText} size="medium" />
        </div>
      </div>
    </section>
  );
};

export default Report;
