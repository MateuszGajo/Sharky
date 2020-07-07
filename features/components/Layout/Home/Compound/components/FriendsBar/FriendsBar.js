import React, { useRef, useEffect, useState, useContext } from "react";
import cx from "classnames";
import { WizzardContext } from "../../context/WizzardContext";
import { getFriends } from "../../services/Functions/index";
import AppContext from "../../../../../../context/AppContext";

const FriendsBar = () => {
  const friendsBar = useRef(null);

  const { socket } = useContext(AppContext);

  const [isFriendsBarScrolling, setStatusOfFriendsBarScrolling] = useState(
    false
  );
  const { setStatusOfMessenger, setChat } = useContext(WizzardContext);
  const [users, setUsers] = useState([]);

  let timeout = {
    friendsBar: null,
  };

  const showScroll = () => {
    if (timeout.friendsBar) {
      clearTimeout(timeout.friendsBar);
    }
    setStatusOfFriendsBarScrolling(true);

    timeout.friendsBar = setTimeout(() => {
      setStatusOfFriendsBarScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    friendsBar.current.addEventListener("wheel", showScroll);

    getFriends({ users, setUsers, socket });
  }, []);

  return (
    <div className="home__wrapper home__wrapper--medium">
      <div
        ref={friendsBar}
        className={cx("home__wrapper__friends primary-scroll", {
          "primary-scroll-active": isFriendsBarScrolling,
        })}
      >
        <div className="home_friends__list">
          {users.map((user, index) => {
            return (
              <div
                className="home_friends__list__item"
                key={user.id}
                data-testid={`friend${index}`}
                onClick={() => {
                  setChat({
                    user: {
                      id: user.idUser,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      photo: user.photo,
                    },
                    idChat: user.idChat,
                  });
                  setStatusOfMessenger(false);
                }}
              >
                <div className="home_friends__list__item__user">
                  <div className="home_friends__list__item__user__photo">
                    <img
                      src={"/static/images/" + user.photo}
                      alt=""
                      className="home_friends__list__item__user__photo--img"
                    />
                  </div>
                  <div className="home_friends__list__item__user--name">
                    <span className="home_friends__list__item__user--name--span">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </div>
                {/* {friend.online ? (
                  <div className="home_friends__list__item--online">
                    <div className="home_friends__list__item--online--circle"></div>
                  </div>
                ) : null} */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendsBar;
