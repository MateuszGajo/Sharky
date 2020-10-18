import React, { useContext } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import CardContext from "../../context/CardContext";

const Collapse = ({ collapseRef }) => {
  const {
    refId,
    setButtonName,
    setTitle,
    buttonName,
    setRelation,
    collapseItems,
  } = useContext(CardContext);

  const { green, blue, pink } = collapseItems || {};

  const items = [
    {
      id: 1,
      name: green.name,
      title: green.title,
      className: "primary-background",
    },
    {
      id: 2,
      name: pink.name,
      title: pink.title,
      className: "pal-background",
    },
    {
      id: 3,
      name: blue.name,
      title: blue.title,
      className: "family-background",
    },
  ];
  return (
    <div
      className="card__item__info__second-column__buttons__change-status"
      data-testid="card-update-button"
      ref={collapseRef}
    >
      {items.map(({ id, name, title, className }) => (
        <div
          className={cx(
            `card__item__info__second-column__buttons__change-status__circle ${className}`,
            {
              "brightness-reduce hover-brightness": name !== buttonName,
            }
          )}
          onClick={() => {
            if (buttonName !== name) {
              setRelation({
                id: refId,
                subId: id,
                name,
                setButtonName,
                setTitle,
              });
            }
          }}
          key={id}
        >
          <span>{title}</span>
        </div>
      ))}
    </div>
  );
};

const element = typeof Element === "undefined" ? function () {} : Element;
Collapse.propTypes = {
  collapseRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(element) }),
  ]),
};

export default Collapse;
