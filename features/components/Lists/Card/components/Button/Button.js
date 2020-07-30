import React, { useRef, useState, useEffect } from "react";
import cx from "classnames";

const Button = ({
  button,
  greenName,
  blueName,
  pinkName,
  buttonName,
  setButtonName,
  collapseItems,
  handleClick,
  idRef,
  setIdRef,
  id,
  refType,
  number,
  setNumber,
  title,
  setTitle,
  collapse,
  setCollapse,
  unsubTitle,
  acceptInvite,
  declineInvite,
  inviteType,
  setInvite,
  setInviteType,
  setButton,
  collapseRef,
}) => {
  const buttonRef = useRef(null);

  const removeFriend = () => {
    handleClick({
      name: refType,
      idRef,
      setIdRef,
      id,
    });
  };

  const changeFriendButton = () => {
    setButton("join");

    buttonRef.current.addEventListener("click", removeFriend);

    buttonRef.current.innerHTML = unsubTitle;
  };

  const resetFriendButton = () => {
    setButton("relation");
    removeEventListener("click", removeFriend);

    buttonRef.current.innerHTML = title;
  };

  useEffect(() => {
    if (collapse) {
      buttonRef.current.addEventListener("mouseover", changeFriendButton);
      buttonRef.current.addEventListener("mouseout", resetFriendButton);
    }
    () => {
      removeEventListener("mouseover", changeFriendButton);
      removeEventListener("mouseout", resetFriendButton);
    };
  }, [collapse]);

  useEffect(() => {
    if (collapseRef.current) {
      collapseRef.current.addEventListener("mouseover", changeFriendButton);
      collapseRef.current.addEventListener("mouseout", resetFriendButton);
    }

    return () => {
      removeEventListener("mouseover", changeFriendButton);
      removeEventListener("mouseout", resetFriendButton);
    };
  }, [collapseRef]);

  useEffect(() => {
    return () => {
      removeEventListener("click", removeFriend);
    };
  }, []);
  return (
    <div
      className={cx("card__item__info__second-column__buttons--main-button ", {
        "card__item__info__second-column__buttons--relation":
          button === "relation",
        "card__item__info__second-column__buttons--join": button === "join",
        "primary-background":
          greenName === buttonName && collapseItems && button == "relation",
        "family-background":
          blueName === buttonName && collapseItems && button == "relation",
        "pal-background":
          pinkName === buttonName && collapseItems && button == "relation",
      })}
      ref={buttonRef}
      data-testid="card-button"
      onClick={() => {
        if (button == "join") {
          if (inviteType) {
            setInvite({
              inviteType,
              setInviteType,
              setButton,
              setTitle,
              setCollapse,
              setButtonName,
              number,
              setNumber,
              idFriendShip: idRef,
            });
          } else {
            idRef ? setNumber(number - 1) : setNumber(number + 1);
            handleClick({
              name: refType,
              idRef,
              setIdRef,
              id,
            });
          }
        }
      }}
    >
      <span
        className="card__item__info__second-column__buttons--main-button--span"
        data-testid="card-button-text"
      >
        {inviteType == "accept"
          ? acceptInvite
          : inviteType == "decline"
          ? declineInvite
          : title}
      </span>
    </div>
  );
};

export default Button;
