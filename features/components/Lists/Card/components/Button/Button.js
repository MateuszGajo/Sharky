import React, { useRef, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { BsEnvelope } from "react-icons/bs";
import CardContext from "../../context/CardContext";

const Button = ({ collapseRef, title: primaryTitle, invitationType }) => {
  const {
    buttonType,
    buttonName,
    setButtonName,
    collapseItems,
    handleClick,
    handleCollapseClick,
    refId,
    setRefId,
    id,
    refType,
    number,
    setNumber,
    title,
    setTitle,
    collapse,
    setCollapse,
    setInvite,
    setButtonType,
    isInvitationSent: statusOfSendInvitation,
    deleteText,
    isInvited,
    setStatusOfInvited,
  } = useContext(CardContext);

  const { green, blue, pink } = collapseItems || {};
  const buttonRef = useRef(null);

  const [isInvitationSent, setStatusOfInvitation] = useState(
    statusOfSendInvitation
  );
  const [isOpen, setStatusOfOpen] = useState(false);

  const removeFriend = () => {
    handleCollapseClick({
      name: refType,
      refId,
      setRefId,
      id,
    });
  };

  const changeFriendButton = () => {
    setButtonType("join");

    buttonRef.current.addEventListener("click", removeFriend);

    setStatusOfOpen(true);
  };

  const resetFriendButton = () => {
    setButtonType("relation");
    removeEventListener("click", removeFriend);

    setStatusOfOpen(false);
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

  return (
    <div
      className={cx("card__item__info__second-column__buttons__main-button ", {
        "card__item__info__second-column__buttons--relation":
          buttonType === "relation",
        "card__item__info__second-column__buttons--join": buttonType === "join",
        "card__item__info__second-column__buttons--join--no-cursor":
          buttonType === "join" && isInvitationSent,
        "primary-background":
          green?.name === buttonName &&
          collapseItems &&
          buttonType == "relation",
        "family-background":
          blue?.name === buttonName &&
          collapseItems &&
          buttonType == "relation",
        "pal-background":
          pink?.name === buttonName &&
          collapseItems &&
          buttonType == "relation",
      })}
      ref={buttonRef}
      data-testid="card-button"
      onClick={() => {
        if (buttonType == "join" && !isInvitationSent) {
          if (isInvited) {
            setInvite({
              invitationType,
              setButtonType,
              setTitle,
              setCollapse,
              setButtonName,
              number,
              setNumber,
              friendshipId: refId,
              id,
              setStatusOfInvited,
            });
          } else if (!isOpen) {
            handleClick({
              name: refType,
              refId,
              setRefId,
              id,
              number,
              setNumber,
              setStatusOfInvitation,
              setTitle,
            });
          }
        }
      }}
    >
      {isInvitationSent && (
        <span className="card__item__info__second-column__buttons__main-button__icon">
          <BsEnvelope />
        </span>
      )}
      <span
        className="card__item__info__second-column__buttons__main-button__span"
        data-testid="card-button-text"
      >
        {primaryTitle ? primaryTitle : isOpen ? deleteText : title}
      </span>
    </div>
  );
};
const element = typeof Element === "undefined" ? function () {} : Element;
Button.propTypes = {
  collapseRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(element) }),
  ]),
  title: PropTypes.string,
  invitationType: PropTypes.string,
};

export default Button;
