import React, { useEffect, useState, useContext } from "react";
import i18next from "../i18n";
import Spinner from "../features/components/Spinner/Spinner";
import Posts from "../features/components/Lists/Posts/Posts";
import HomeLayout from "../features/components/Layout/Home/HomeLayout";
import AppContext from "../features/context/AppContext";
import BadRequest from "../features/common/PopUp/BadRequest/BadRequest";
import "../styles/main.scss";

const Index = () => {
  const [initialized, setInitialized] = useState(false);
  // const [text, setText] = useState("");

  const { socket, isBadRequest } = useContext(AppContext);

  useEffect(() => {
    i18next.initPromise.then((resp) => setInitialized(true));
    // socket.emit("chat", 2);
  }, []);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   socket.emit("sendChatMessage", {
  //     chat: 2,
  //     message: text,
  //     date: new Date(),
  //   });
  // };

  if (!initialized) return <Spinner />;

  return (
    <>
      {isBadRequest && <BadRequest />}
      <HomeLayout>
        {/* <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setText(e.target.value)} />
        <button>wyslij</button>
      </form> */}
        <Posts />
      </HomeLayout>
    </>
  );
};

export default Index;
