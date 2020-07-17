import React, { useContext } from "react";
import Mess from "@components/Messenger/Messenger";
import { WizzardContext } from "../../context/WizzardContext";

const Messenger = () => {
  const { isMessengerClose, setStatusOfMessenger, chat } = useContext(
    WizzardContext
  );

  return (
    <div className="home__messenger">
      {!isMessengerClose && (
        <Mess
          chat={chat}
          windowMessenger={true}
          isMessengerClose={isMessengerClose}
          setStatusOfMessenger={setStatusOfMessenger}
        />
      )}
    </div>
  );
};

export default Messenger;
