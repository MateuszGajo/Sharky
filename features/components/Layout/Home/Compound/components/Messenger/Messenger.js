import React, { useContext } from "react";
import Mess from "~components/Messenger/Messenger";
import { WizzardContext } from "../../context/WizzardContext";

const Messenger = () => {
  const { isMessengerClose, setStatusOfMessenger, chat, setChat } = useContext(
    WizzardContext
  );

  return (
    <div className="home__messenger">
      {!isMessengerClose && (
        <Mess
          chat={chat}
          setChat={setChat}
          windowMessenger
          isMessengerClose={isMessengerClose}
          setStatusOfMessenger={setStatusOfMessenger}
        />
      )}
    </div>
  );
};

export default Messenger;
