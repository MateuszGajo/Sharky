import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";

const RelationButton = ({
  buttons,
  idUser,
  setButtonName,
  setRelation,
  handleCollapseClick,
  deleteTitle = "delete",
  size = "large",
  fieldName,
  blockCollapse = true,
  setNumber = () => {},
}) => {
  const { green, pink, blue } = buttons;
  const items = [
    {
      id: 1,
      color: "green",
      name: green.name,
      title: green.title,
      className: "primary-background",
    },
    {
      id: 2,
      color: "pink",
      name: pink.name,
      title: pink.title,
      className: "pal-background",
    },
    {
      id: 3,
      color: "blue",
      name: blue.name,
      title: blue.title,
      className: "family-background",
    },
  ];

  const collapseRef = useRef();
  const buttonRef = useRef();

  const [isCollapse, setStatusOfCollapse] = useState(true);

  const removeFriend = () => {
    handleCollapseClick({
      id: idUser,
      setNumber,
    });
  };

  const changeFriendButton = () => {
    buttonRef.current.addEventListener("click", removeFriend);

    setStatusOfCollapse(false);
  };

  const resetFriendButton = () => {
    removeEventListener("click", removeFriend);

    setStatusOfCollapse(true);
  };

  useEffect(() => {
    if (!blockCollapse) {
      buttonRef.current.addEventListener("mouseover", changeFriendButton);
      buttonRef.current.addEventListener("mouseout", resetFriendButton);
    }

    () => {
      removeEventListener("mouseover", changeFriendButton);
      removeEventListener("mouseout", resetFriendButton);
    };
  }, [buttonRef]);

  useEffect(() => {
    return () => {
      removeEventListener("click", removeFriend);
    };
  }, []);

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
          {items.map(({ id, name, title, className, color }) => (
            <div
              className={cx(
                `relation-buttons__colllapse__buttons relation-buttons__circle-button ${className}`,
                {
                  "brightness-reduce hover-brightness": fieldName !== color,
                  "relation-buttons--small": size === "small",
                  "relation-buttons--medium": size === "medium",
                  "relation-buttons--large": size === "large",
                }
              )}
              onClick={() => {
                if (fieldName !== color) {
                  setRelation({
                    id: idUser,
                    name,
                    setButtonName,
                  });
                }
              }}
              key={id}
            >
              <span>{title}</span>
            </div>
          ))}
        </div>
      )}

      <div className="relation-buttons__primary" ref={buttonRef}>
        <div
          className={cx("relation-buttons__primary__button ", {
            "primary-background": isCollapse && fieldName === "green",
            "pal-background": isCollapse && fieldName === "pink",
            "pink-background": isCollapse && fieldName === "pink",
            "relation-buttons--small": size === "small",
            "relation-buttons--medium": size === "medium",
            "relation-buttons--large": size === "large",
            "relation-buttons__circle-button": isCollapse,
            "relation-buttons__colllapse__buttons--delete":
              !blockCollapse && !isCollapse,
          })}
        >
          {isCollapse ? buttons[fieldName].title : deleteTitle}
        </div>
      </div>
    </div>
  );
};

export default RelationButton;
