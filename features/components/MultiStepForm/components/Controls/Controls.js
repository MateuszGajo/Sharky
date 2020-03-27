import React, { useContext } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import "./controls.scss";
import { WizzardContext } from "../../context/WizzardContext";
import cx from "classnames";

const Controls = () => {
  const { page, setPage, numberOfPages } = useContext(WizzardContext);
  console.log(numberOfPages);
  return (
    <div className="authentication__form__wrapper__controls">
      <div className="authentication__form__wrapper__controls__pagination">
        <button
          type="button"
          className={cx(
            "authentication__form__wrapper__controls__pagination--button",
            { "disabled--button": page === 1 }
          )}
          onClick={() => {
            setPage(page - 1);
          }}
          disabled={page === 1}
        >
          <GoArrowLeft />
        </button>
        <button
          type="button"
          className="authentication__form__wrapper__controls__pagination--button"
          onClick={() => {
            setPage(page + 1);
          }}
          disabled={page === numberOfPages}
        >
          <GoArrowRight />
        </button>
      </div>
      <button
        type="submit"
        className="authentication__form__wrapper__controls--submitButton"
      >
        Zarejstruj
      </button>
    </div>
  );
};

export default Controls;
