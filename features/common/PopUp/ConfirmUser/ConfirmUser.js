import React from "react";
import { IoMdClose } from "react-icons/io";

const ConfirmUser = () => {
  return (
    <div className="confrim-user-container">
      <div className="confrim-user-container__content">
        <div className="confrim-user-container__content--icon">
          <IoMdClose />
        </div>

        <div className="confrim-user-container__content--title">
          <h3 className="confrim-user-container__content--title--h3">
            Potwierdź hasło
          </h3>
        </div>
        <div className="confrim-user-container__content__data">
          <form className="confrim-user-container__content__data__form">
            <input
              className="confrim-user-container__content__data__form--input"
              type="text"
            />
            <button>Dalej</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUser;
