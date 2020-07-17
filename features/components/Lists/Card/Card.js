import React from "react";
import cx from "classnames";
import Router from "@features/route/routes";

const Card = ({
  data = {
    refType: "profile",
    refId: "123",
    photo: "profile.png",
    radiusPhoto: true,
    name: "Janek Kowalski",
    description: "Coś tam",
    button: "join",
    buttonName: "pal",
    title: "Przyjaciel",
    collapse: true,
    collapseItems: {
      pink: {
        name: "pal",
        title: "Przyjaciel",
      },
      blue: {
        name: "family",
        title: "Rodzina",
      },
      green: {
        name: "friend",
        title: "Znajomy",
      },
    },
  },
  updateRelation = null,
  join = null,
}) => {
  const {
    refType,
    refId,
    photo,
    name,
    description,
    button,
    title,
    buttonName = null,
    collapse,
    collapseItems = null,
    radiusPhoto,
  } = data;
  const { green: greenC, blue: blueC, pink: pinkC } = collapseItems || {};

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
            {title ? (
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
                      join({
                        name: refType,
                        id: refId,
                      });
                    }
                  }}
                >
                  <span
                    className="card__item__info__second-column__buttons--main-button--span"
                    data-testid="card-button-text"
                  >
                    {title}
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
                          updateRelation({
                            id: refId,
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
                          updateRelation({
                            id: refId,
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
                          updateRelation({
                            id: refId,
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
