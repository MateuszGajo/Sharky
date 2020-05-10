import React, { useContext } from "react";
import Mess from "../../../../../Messenger/Messenger";
import { WizzardContext } from "../../context/WizzardContext";

const Messenger = () => {
  const { isMessengerClose, setStatusOfMessenger } = useContext(WizzardContext);

  return (
    <Mess
      windowMessenger={true}
      isMessengerClose={isMessengerClose}
      setStatusOfMessenger={setStatusOfMessenger}
    />
  );
};

export default Messenger;
