import React, { useState, useRef, useEffect, useContext } from "react";
import { MdSend } from "react-icons/md";
import AppContext from "../../../../context/AppContext";
import i18next from "../../../../../i18n";
const { useTranslation } = i18next;

const Downbar = ({ idChat, setMessages, messages }) => {
  const { t } = useTranslation(["component"]);

  const placeholder = t("component:messenger.placeholder");

  const { socket, owner } = useContext(AppContext);

  const [message, setMessage] = useState("");

  const messageArea = useRef(null);
  const messageForm = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const date = new Date();
    socket.emit("sendChatMessage", { idChat, message, date });
    setMessages([...messages, { idUser: owner.id, message, date }]);
  };

  useEffect(() => {
    messageArea.current.addEventListener("keydown", function textAreaSubmit(e) {
      if (e.keyCode == 13) {
        messageForm.current.dispatchEvent(new Event("submit"));
      }
    });
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
