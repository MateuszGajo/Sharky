import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { MdSend } from "react-icons/md";
import AppContext from "~features/context/AppContext";
import i18next from "~i18n";
import { addMessage } from "../../services/Functions";

const { useTranslation } = i18next;

const Downbar = ({ setMessages, converser }) => {
  const { t } = useTranslation(["component"]);

  const placeholder = t("component:messenger.placeholder");

  const { socket, owner, setError } = useContext(AppContext);

  const [message, setMessage] = useState("");

  const messageArea = useRef(null);
  const messageForm = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message) {
      addMessage({
        message,
        userId: converser,
        socket,
        messageFrom: owner.id,
        setError,
        setMessage,
        setMessages,
      });
    }
  };

  const addKeySubmit = (e) => {
    if (e.keyCode === 13) {
      if (!message) {
        messageForm.current.dispatchEvent(
          new Event("submit", { cancelable: true })
        );
      }
    }
  };

  useEffect(() => {
    messageArea.current.addEventListener("keydown", addKeySubmit);

    return () => {
      messageArea.current.removeEventListener("keydown", addKeySubmit);
    };
  }, []);

  return (
    <div className="messenger__downbar">
      <form
        onSubmit={handleSubmit}
        ref={messageForm}
        className="messenger__downbar__form"
      >
        <div className="messenger__downbar__form__text">
          <textarea
            value={message}
            ref={messageArea}
            type="text"
            className="messenger__downbar__form__text__textarea"
            placeholder={placeholder}
            data-testid="messenger-text"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="messenger__downbar__form__send">
          <button
            className={cx("messenger__downbar__form__send__buton", {
              "messenger__downbar__form__send__buton--disabled": !message,
            })}
            data-testid="messenger-send-button"
            disabled={!message}
            type="button"
          >
            <MdSend />
          </button>
        </div>
      </form>
    </div>
  );
};

Downbar.propTypes = {
  setMessages: PropTypes.func.isRequired,
  converser: PropTypes.number.isRequired,
};

export default Downbar;
