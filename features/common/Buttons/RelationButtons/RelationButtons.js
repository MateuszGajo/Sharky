import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const RelationButton = ({
  buttons,
  userId,
  refId,
  setButtonName,
  setRelation,
  handleCollapseClick,
  deleteTitle = "delete",
  size = "large",
  title: initialTitle,
  blockCollapse = true,
  setNumber,
  setRefId,
}) => {
  const { green, pink, blue } = buttons;
  const items = {
    [green.name]: {
      id: 1,
      color: "green",
      name: green.name,
      title: green.title,
      className: "primary-background",
    },
    [pink.name]: {
      id: 2,
      color: "pink",
      name: pink.name,
      title: pink.title,
      className: "pal-background",
    },
    [blue.name]: {
      id: 3,
      color: "blue",
      name: blue.name,
      title: blue.title,
      className: "family-background",
    },
  };

  const collapseRef = useRef();
  const buttonRef = useRef();

  const [isCollapse, setStatusOfCollapse] = useState(true);
  const [title, setTitle] = useState(initialTitle);

  const removeFriend = () => {
    handleCollapseClick({ id: userId, refId, setNumber, setRefId });
  };

  const changeFriendButton = () => {
    buttonRef.current.addEventListener("click", removeFriend);

    setStatusOfCollapse(false);
  };

  const resetFriendButton = () => {
    buttonRef.current.removeEventListener("click", removeFriend);

    setStatusOfCollapse(true);
  };

  useEffect(() => {
    if (!blockCollapse) {
      buttonRef.current.addEventListener("mouseover", changeFriendButton);
      buttonRef.current.addEventListener("mouseout", resetFriendButton);
    }

    return () => {
      buttonRef.current.removeEventListener("mouseover", changeFriendButton);
      buttonRef.current.removeEventListener("mouseout", resetFriendButton);
    };
  }, [buttonRef]);

  useEffect(
    () => () => {
      buttonRef.current.removeEventListener("click", removeFriend);
    },
    []
  );

  return (
    <div className="relation-buttons">
      {!blockCollapse && (
        <div
          className={cx("relation-buttons__colllapse", {
            "relation-buttons__colllapse--hidden": isCollapse,
          })}
          data-testid="card-update-button"
          ref={collapseRef}
        >
          {Object.keys(items).map((key) => {
            const { id, name, color, title: itemTitle, className } = items[key];
            return (
              <div
                className={cx(
                  `relation-buttons__colllapse__buttons relation-buttons__circle-button ${className}`,
                  {
                    "brightness-reduce hover-brightness":
                      items[title].color !== color,
                    "relation-buttons--small": size === "small",
                    "relation-buttons--medium": size === "medium",
                    "relation-buttons--large": size === "large",
                  }
                )}
                onClick={() => {
                  if (items[title].color !== color) {
                    setRelation({
                      id: userId,
                      name,
                      setButtonName,
                      setTitle,
                    });
                  }
                }}
                aria-hidden="true"
                key={id}
              >
                <span>{itemTitle}</span>
              </div>
            );
          })}
        </div>
      )}
      <div className="relation-buttons__primary" ref={buttonRef}>
        <div
          className={cx("relation-buttons__primary__button ", {
            "primary-background": isCollapse && items[title].color === "green",
            "family-background": isCollapse && items[title].color === "blue",
            "pal-background": isCollapse && items[title].color === "pink",
            "relation-buttons--small": size === "small",
            "relation-buttons--medium": size === "medium",
            "relation-buttons--large": size === "large",
            "relation-buttons__circle-button": isCollapse,
            "relation-buttons__colllapse__buttons--delete":
              !blockCollapse && !isCollapse,
          })}
        >
          {isCollapse ? items[title].title : deleteTitle}
        </div>
      </div>
    </div>
  );
};

RelationButton.defaultProps = {
  deleteTitle: "delete",
  size: "large",
  blockCollapse: true,
  setRelation: () => {},
  setButtonName: () => {},
  userId: null,
  refId: null,
  handleCollapseClick: () => {},
  setNumber: () => {},
  setRefId: () => {},
};

RelationButton.propTypes = {
  buttons: PropTypes.shape({
    green: PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
    pink: PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
    blue: PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  }).isRequired,
  userId: PropTypes.number,
  refId: PropTypes.number,
  setButtonName: PropTypes.func,
  setRelation: PropTypes.func,
  handleCollapseClick: PropTypes.func,
  deleteTitle: PropTypes.string,
  size: PropTypes.number,
  title: PropTypes.string.isRequired,
  blockCollapse: PropTypes.bool,
  setNumber: PropTypes.func,
  setRefId: PropTypes.func,
};

export default RelationButton;
