import React from "react";
import cx from "classnames";

const Collapse = ({
  id,
  idRef,
  buttonName,
  setButtonName,
  setTitle,
  greenName,
  greenTitle,
  pinkName,
  pinkTitle,
  blueName,
  blueTitle,
  setRelation,
  collapseRef,
}) => {
  return (
    <div
      className="card__item__info__second-column__buttons--change-status"
      data-testid="card-update-button"
      ref={collapseRef}
    >
      <div
        className={cx(
          "card__item__info__second-column__buttons--change-status--circle primary-background",
          {
            "brightness-reduce hover-brightness": greenName !== buttonName,
          }
        )}
        onClick={() => {
          if (buttonName !== greenName) {
            setRelation({
              id: idRef,
              idSub: id,
              name: greenName,
              setButtonName,
              setTitle,
            });
          }
        }}
        data-testid="card-relation-button-green"
      >
        <span>{greenTitle}</span>
      </div>
      <div
        className={cx(
          "card__item__info__second-column__buttons--change-status--circle pal-background ",
          {
            "brightness-reduce hover-brightness": pinkName !== buttonName,
          }
        )}
        onClick={() => {
          if (buttonName !== pinkName) {
            setRelation({
              id: idRef,
              idSub: id,
              name: pinkName,
              setButtonName,
              setTitle,
            });
          }
        }}
        data-testid="card-relation-button-pink"
      >
        <span>{pinkTitle}</span>
      </div>
      <div
        className={cx(
          "card__item__info__second-column__buttons--change-status--circle family-background ",
          {
            "brightness-reduce hover-brightness": blueName !== buttonName,
          }
        )}
        onClick={() => {
          if (buttonName !== blueName) {
            setRelation({
              id: idRef,
              idSub: id,
              name: blueName,
              setButtonName,
              setTitle,
            });
          }
        }}
        data-testid="card-relation-button-blue"
      >
        <span>{blueTitle}</span>
      </div>
    </div>
  );
};

export default Collapse;
