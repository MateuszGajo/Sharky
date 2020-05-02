import React, { useContext } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import cx from "classnames";
import { WizzardContext } from "../../context/WizzardContext";
import PrimaryButton from "../../../../common/PrimaryButton/PrimaryButton";

const Controls = () => {
  const { page, setPage, numberOfPages } = useContext(WizzardContext);
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
          data-testid="form-pagination-left"
        >
          <GoArrowLeft />
        </button>
        <button
          type="button"
          className={cx(
            "authentication__form__wrapper__controls__pagination--button",
            { "disabled--button": page === numberOfPages }
          )}
          onClick={() => {
            setPage(page + 1);
          }}
          disabled={page === numberOfPages}
          data-testid="form-pagination-right"
        >
          <GoArrowRight />
        </button>
      </div>
      <div className="authentication__form__wrapper__controls--submit-buton">
        <PrimaryButton
          isDisable={page !== numberOfPages}
          value="Zarejstruj"
          size="large"
        />
      </div>
    </div>
  );
};

export default Controls;