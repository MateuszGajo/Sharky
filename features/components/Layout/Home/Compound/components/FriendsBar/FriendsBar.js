import React, { useRef, useEffect, useState, useContext } from "react";
import cx from "classnames";
import Item from "./components/Item/Item";
import { getFriends } from "../../services/Functions";
import AppContext from "@features/context/AppContext";

const FriendsBar = () => {
  const friendsBar = useRef(null);
  const { socket, newChat } = useContext(AppContext);

  const [isFriendsBarScrolling, setStatusOfFriendsBarScrolling] = useState(
    false
  );
  const [users, setUsers] = useState([]);

  let timeout;

  const showScroll = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setStatusOfFriendsBarScrolling(true);

    timeout = setTimeout(() => {
      setStatusOfFriendsBarScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    friendsBar.current.addEventListener("wheel", showScroll);
    getFriends({ users, setUsers });

    return () => {
      removeEventListener("whell", showScroll);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (users.length) socket.emit("joinChat");
  }, [users]);

  useEffect(() => {
    if (newChat.idChat) {
      console.log(newChat);
      setUsers([...users, newChat]);
    }
  }, [newChat]);

  return (
    <div className="home__wrapper home__wrapper--medium">
      <div
        ref={friendsBar}
        className={cx("home__wrapper__friends primary-scroll", {
          "primary-scroll-active": isFriendsBarScrolling,
        })}
      >
        <div className="home_friends__list">
          {users.map((user) => {
            return <Item key={user.idChat} user={user} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendsBar;
