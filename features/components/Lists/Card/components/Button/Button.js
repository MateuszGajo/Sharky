import React, { useRef, useState, useEffect } from "react";
import cx from "classnames";
import { BsEnvelope } from "react-icons/bs";

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
  title: t,
  setTitle,
  collapse,
  setCollapse,
  unsubTitle,
  acceptInvite,
  declineInvite,
  sentInvite,
  inviteType,
  setInvite,
  setInviteType,
  setButton,
  collapseRef,
  isInvited,
  isInvationSent,
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

    buttonRef.current.innerHTML = title();
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
    if (collapseRef?.current) {
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

  const title = () => {
    if (inviteType == "accept") return acceptInvite;
    if (inviteType == "decline") return declineInvite;
    if (isInvationSent) return sentInvite;
    return t;
  };
  return (
    <div
      className={cx("card__item__info__second-column__buttons--main-button ", {
        "card__item__info__second-column__buttons--relation":
          button === "relation",
        "card__item__info__second-column__buttons--join": button === "join",
        "card__item__info__second-column__buttons--join--no-cursor":
          button === "join" && isInvationSent,
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
            handleClick({
              name: refType,
              idRef,
              setIdRef,
              id,
              number,
              setNumber,
            });
          }
        }
      }}
    >
      {isInvationSent && (
        <span className="card__item__info__second-column__buttons--main-button__icon">
          <BsEnvelope />
        </span>
      )}

      <span
        className="card__item__info__second-column__buttons--main-button--span"
        data-testid="card-button-text"
      >
        {title()}
      </span>
    </div>
  );
};

export default Button;
