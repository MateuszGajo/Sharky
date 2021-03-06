import React, { useRef, useContext } from "react";
import PropTypes from "prop-types";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import cx from "classnames";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import i18next from "~i18n";
import AppContext from "~features/context/AppContext";

const { useTranslation } = i18next;

const MessageBox = ({
  value,
  onChange,
  btnSize = "medium",
  file,
  setFile,
  news = false,
}) => {
  const { t } = useTranslation(["common"]);
  const { setError } = useContext(AppContext);

  const title = t("common:message-box.title");
  const description = t("common:message-box.description");
  const buttonText = t("common:message-box.button");
  const newsDescription = t("common:message-box.news-description");

  const imageRef = useRef(null);

  const previewImage = (e) => {
    const { type, size } = e.target.files[0];

    if (type !== "image/png" && type !== "image/jpeg") {
      return setError("wrong-file-type");
    }
    if (size > 200000) {
      return setError("file-too-large");
    }
    const reader = new FileReader();

    reader.onload = (event) => {
      imageRef.current.setAttribute("src", event.target.result);
    };

    reader.readAsDataURL(e.target.files[0]);
    return setFile(e.target.files[0]);
  };

  return (
    <div data-testid="message-box" className="message-box">
      <div className="message-box__navbar">{title}</div>
      <div className="message-box__content">
        <textarea
          placeholder={news ? newsDescription : description}
          className="message-box__content--textarea"
          data-testid="message-box-textarea"
          required={!file}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="message-box__downbar">
        <div className="message-box__downbar__upload">
          {file ? (
            <div className="message-box__downbar____upload__photo">
              <img
                alt=""
                className={cx("message-box__downbar__upload__photo", {
                  "message-box__downbar__upload__photo--small":
                    btnSize === "small",
                  "message-box__downbar__upload__photo--medium":
                    btnSize === "medium",
                  "message-box__downbar__upload__photo--large":
                    btnSize === "large",
                  "message-box__downbar__upload__photo--x-large":
                    btnSize === "x-large",
                })}
                ref={imageRef}
              />
              <div className="message-box__downbar____upload__photo__overlay">
                <div
                  className="message-box__downbar____upload__photo__overlay__delete"
                  onClick={() => setFile(null)}
                  aria-hidden="true"
                >
                  <AiOutlineClose />
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="file-upload"
              className={cx("message-box__downbar__upload__label", {
                "message-box__downbar__upload__label--small":
                  btnSize === "small",
                "message-box__downbar__upload__label--medium":
                  btnSize === "medium",
                "message-box__downbar__upload__label--large":
                  btnSize === "large",
                "message-box__downbar__upload__label--x-large":
                  btnSize === "x-large",
              })}
            >
              <IoIosAddCircleOutline />
            </label>
          )}

          <input
            type="file"
            name="file"
            id="file-upload"
            className="message-box__downbar__upload__file"
            onChange={previewImage}
          />
        </div>
        <div className="message-box__downbar__send-button">
          <PrimaryButton value={buttonText} size={btnSize} />
        </div>
      </div>
    </div>
  );
};

MessageBox.defaultProps = {
  btnSize: "medium",
  news: false,
  file: null,
};

MessageBox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  btnSize: PropTypes.string,
  file: PropTypes.objectOf(PropTypes.object),
  setFile: PropTypes.func.isRequired,
  news: PropTypes.bool,
};

export default MessageBox;
