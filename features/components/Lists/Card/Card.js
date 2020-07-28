import React, { useState, useRef } from "react";
import cx from "classnames";
import Router from "@features/route/routes";
import { useEffect } from "react";

const Card = ({ data, setRelation, handleClick }) => {
  const {
    refType,
    id,
    photo,
    name,
    description,
    number: n,
    button,
    subTitle = null,
    unsubTitle,
    title,
    buttonName = null,
    collapse,
    collapseItems = null,
    radiusPhoto,
  } = data;
  const { green: greenC, blue: blueC, pink: pinkC } = collapseItems || {};
  console.log(unsubTitle);
  const collapseRef = useRef(null);

  const [idRef, setIdRef] = useState(data.idRef);
  const [number, setNumber] = useState(n);

  const removeFriend = () => {
    handleClick({
      name: refType,
      idRef,
      setIdRef,
      id,
    });
  };

  const changeFriendButton = () => {
    collapseRef.current.classList.remove(
      "card__item__info__second-column__buttons--relation"
    );
    collapseRef.current.classList.add(
      "card__item__info__second-column__buttons--join"
    );

    collapseRef.current.addEventListener("click", removeFriend);

    collapseRef.current.innerHTML = unsubTitle;
  };

  const resetFriendButton = () => {
    collapseRef.current.classList.add(
      "card__item__info__second-column__buttons--relation"
    );
    collapseRef.current.classList.remove(
      "card__item__info__second-column__buttons--join"
    );

    removeEventListener("click", removeFriend);

    collapseRef.current.innerHTML = title;
  };

  useEffect(() => {
    if (collapse) {
      collapseRef.current.addEventListener("mouseover", changeFriendButton);
      collapseRef.current.addEventListener("mouseleave", resetFriendButton);
    }
    // console.log(collapseRef.current.style.visiblity);
  }, []);

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
              Router.pushRoute(refType, { id });
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
                    id,
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
                  {description + ":" + number}
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
                  ref={collapseRef}
                  data-testid="card-button"
                  onClick={() => {
                    if (button == "join") {
                      idRef ? setNumber(number - 1) : setNumber(number + 1);
                      handleClick({
                        name: refType,
                        idRef,
                        setIdRef,
                        id,
                      });
                    }
                  }}
                >
                  <span
                    className="card__item__info__second-column__buttons--main-button--span"
                    data-testid="card-button-text"
                  >
                    {!title ? (idRef ? unsubTitle : subTitle) : null}
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
                            id: idRef,
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
                            id: idRef,
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
                            id: idRef,
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
