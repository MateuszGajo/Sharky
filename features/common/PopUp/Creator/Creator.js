import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Router from "next/router";
import { RiCloseLine } from "react-icons/ri";
import PrimaryInput from "@common/PrimaryInput/PrimaryInput";
import PrimaryButton from "@common/PrimaryButton/PrimaryButton";
import i18next from "@i18n";

const { useTranslation } = i18next;

const Creator = ({ type, setStatusOfOpen }) => {
  const { t } = useTranslation();

  const createGroup = t("common:pop-up.creator.create-group");
  const createFanpage = t("common:pop-up.creator.create-fanpage");
  const inputName = t("common:pop-up.creator.name");
  const inputDescription = t("common:pop-up.creator.description");
  const buttonTitle = t("common:pop-up.creator.button-title");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`/${type}/create`, { name, description })
      .then(({ data: { id } }) => {
        Router.push(`/${type}/${id}`);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };
  return (
    <section className="creator">
      <div className="creator__container">
        <div
          className="creator__container__close-button"
          onClick={() => setStatusOfOpen(false)}
        >
          <RiCloseLine />
        </div>
        <div className="creator__container__title">
          <h1 className="creator__container__title__h1">
            {type == "group" ? createGroup : type == "fanpage" && createFanpage}
          </h1>
        </div>
        <div className="creator__container__content">
          <form
            className="creator__container__content__form"
            onSubmit={handleSubmit}
          >
            <div className="creator__container__content__form__input">
              <PrimaryInput
                title={inputName}
                value={name}
                onChange={setName}
                require={true}
              />
            </div>
            <div className="creator__container__content__form__input">
              <PrimaryInput
                title={inputDescription}
                value={description}
                onChange={setDescription}
                require={true}
              />
            </div>

            <div className="creator__container__content__form__button">
              <PrimaryButton size="medium" value={buttonTitle} />
            </div>
            {error && (
              <p className="creator__container__content__form__error">
                {t(`common:pop-up.error.${error}`)}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

Creator.propTypes = {
  type: PropTypes.string,
  setStatusOfOpen: PropTypes.func
}

export default Creator;
