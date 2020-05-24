import React, { useContext } from "react";
import Mess from "../../../../../Messenger/Messenger";
import { WizzardContext } from "../../context/WizzardContext";

const Messenger = () => {
  const { isMessengerClose, setStatusOfMessenger } = useContext(WizzardContext);

  return (
    <div className="home__messenger">
      <Mess
        windowMessenger={true}
        isMessengerClose={isMessengerClose}
        setStatusOfMessenger={setStatusOfMessenger}
      />
    </div>
  );
};

export default Messenger;
