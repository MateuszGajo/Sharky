import React, { useState, useRef, useEffect, useContext } from "react";
import { MdSend } from "react-icons/md";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
import { addMessage } from "../../services/Functions";
const { useTranslation } = i18next;

const Downbar = ({ idChat, setMessages, messages, converser }) => {
  const { t } = useTranslation(["component"]);

  const placeholder = t("component:messenger.placeholder");

  const { socket, owner, setError } = useContext(AppContext);

  const [message, setMessage] = useState("");

  const messageArea = useRef(null);
  const messageForm = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const date = new Date();
    setMessages([...messages, { idUser: owner.id, message, date }]);
    addMessage({
      idChat,
      message,
      date,
      idUser: owner.id,
      socket,
      messageTo: converser,
      setError,
      setMessage,
    });
  };

  const addKeySubmit = (e) => {
    if (e.keyCode == 13) {
      messageForm.current.dispatchEvent(new Event("submit"));
    }
  };

  useEffect(() => {
    messageArea.current.addEventListener("keydown", addKeySubmit);

    return () => {
      removeEventListener("keydown", addKeySubmit);
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
            ref={messageArea}
            type="text"
            className="messenger__downbar__form__text--textarea"
            placeholder={placeholder}
            data-testid="messenger-text"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="messenger__downbar__form__send">
          <button
            className="messenger__downbar__form__send--buton"
            data-testid="messenger-send-button"
          >
            <MdSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Downbar;
