import React, { useState } from "react";
import cx from "classnames";
import Router from "@features/route/routes";

const Card = ({ data, setRelation, handleClick }) => {
  const {
    refType,
    refId,
    idRelation,
    photo,
    name,
    description,
    button,
    subTitle = null,
    unsubTitle,
    title,
    buttonName = null,
    collapse,
    collapseItems = null,
    radiusPhoto,
  } = data;
  console.log(title);
  const { green: greenC, blue: blueC, pink: pinkC } = collapseItems || {};

  const [idSub, setIdSub] = useState(data.idSub);

  return (
    <div className="card">
      <div className="card__item">
        <div className="card__item--picture">
          <img
            src={"/static/images/" + photo}
            className={cx("card__item--picture--img", {
              "card__item--picture--img--radius": radiusPhoto === true,
            })}
            onClick={() => {
              Router.pushRoute(refType, { id: refId });
            }}
            data-testid="card-photo"
          />
        </div>
        <div className="card__item__info">
          <div className="card__item__info__first-column">
            <div className="card__item__info__first-column--name">
              <span
                className="card__item__info__first-column--name--span"
                data-testid="card-name"
                onClick={() => {
                  Router.pushRoute(refType, {
                    id: refId,
                  });
                }}
              >
                {name}
              </span>
            </div>
            {description ? (
              <div className="card__item__info__first-column--amounts-of-friends">
                <span
                  className="card__item__info__first-column--amounts-of-friends--span"
                  data-testid="card-description"
                >
                  {description}
                </span>
              </div>
            ) : null}
          </div>

          <div className="card__item__info__second-column">
            {button ? (
              <div
                className="card__item__info__second-column__buttons"
                data-testid="card-buttons"
              >
                <div
                  className={cx(
                    "card__item__info__second-column__buttons--main-button ",
                    {
                      "card__item__info__second-column__buttons--relation":
                        button === "relation",
                      "card__item__info__second-column__buttons--join":
                        button === "join",
                      "primary-background":
                        greenC?.name === buttonName && collapseItems,
                      "family-background":
                        blueC?.name === buttonName && collapseItems,
                      "pal-background":
                        pinkC?.name === buttonName && collapseItems,
                    }
                  )}
                  data-testid="card-button"
                  onClick={() => {
                    if (button == "join") {
                      handleClick({
                        name: refType,
                        idSub,
                        setIdSub,
                        id: refId,
                      });
                    }
                  }}
                >
                  <span
                    className="card__item__info__second-column__buttons--main-button--span"
                    data-testid="card-button-text"
                  >
                    {idSub ? unsubTitle : subTitle}
                    {title && title}
                  </span>
                </div>
                {collapse ? (
                  <div
                    className="card__item__info__second-column__buttons--change-status"
                    data-testid="card-update-button"
                  >
                    <div
                      className={cx(
                        "card__item__info__second-column__buttons--change-status--circle primary-background",
                        {
                          "brightness-reduce hover-brightness":
                            greenC.name !== buttonName,
                        }
                      )}
                      onClick={() => {
                        if (buttonName !== greenC.name) {
                          setRelation({
                            id: idRelation,
                            name: greenC.name,
                          });
                        }
                      }}
                      data-testid="card-relation-button-green"
                    >
                      <span>{greenC.title}</span>
                    </div>
                    <div
                      className={cx(
                        "card__item__info__second-column__buttons--change-status--circle pal-background ",
                        {
                          "brightness-reduce hover-brightness":
                            pinkC.name !== buttonName,
                        }
                      )}
                      onClick={() => {
                        if (buttonName !== pinkC.name) {
                          setRelation({
                            id: idRelation,
                            name: pinkC.name,
                          });
                        }
                      }}
                      data-testid="card-relation-button-pink"
                    >
                      <span>{pinkC.title}</span>
                    </div>
                    <div
                      className={cx(
                        "card__item__info__second-column__buttons--change-status--circle family-background ",
                        {
                          "brightness-reduce hover-brightness":
                            blueC.name !== buttonName,
                        }
                      )}
                      onClick={() => {
                        if (buttonName !== blueC.name) {
                          setRelation({
                            id: idRelation,
                            name: blueC.name,
                          });
                        }
                      }}
                      data-testid="card-relation-button-blue"
                    >
                      <span>{blueC.title}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
