import React, { useRef, useEffect, useState, useContext } from "react";
import cx from "classnames";
import { FaUserCircle } from "react-icons/fa";
import { WizzardContext } from "../../context/WizzardContext";

const FriendsBar = () => {
  const friendsBar = useRef(null);

  const [isFriendsBarScrolling, setStatusOfFriendsBarScrolling] = useState(
    false
  );
  const { setStatusOfMessage } = useContext(WizzardContext);
  const [users, setUser] = useState({
    234: {
      id: 234,
      firstName: "Zbigniew",
      lastName: "Niedziółka-Domański",
      online: true,
    },
    453: {
      id: 453,
      firstName: "Witek",
      lastName: "Zbigniewski",
      online: false,
    },
  });
  const [listOfFriends, setListOfFirends] = useState([
    {
      userId: 234,
      relationShip: "friend",
    },
    {
      userId: 453,
      relationShip: "family",
    },
  ]);

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
  }, []);

  return (
    <div className="fixed-container fixed-container-smaller">
      <div
        ref={friendsBar}
        className={cx("home-wrapper__friends primary-scroll", {
          "primary-scroll-active": isFriendsBarScrolling,
        })}
      >
        <div className="home-wrapper_friends__list">
          {listOfFriends.map((item) => {
            const friend = users[item.userId];
            console.log(friend);
            return (
              <div
                className="home-wrapper_friends__list__item"
                key={friend.id}
                data-testid={`friend${friend.id}`}
                onClick={() => setStatusOfMessage(true)}
              >
                <div className="home-wrapper_friends__list__item__user">
                  <div
                    className={cx(
                      "home-wrapper_friends__list__item__user--icon",
                      {
                        "home-wrapper_friends__list__item--icon--active":
                          friend.online,
                      }
                    )}
                  >
                    <FaUserCircle />
                  </div>
                  <div className="home-wrapper_friends__list__item__user--name">
                    <span className="home-wrapper_friends__list__item__user--name--span">
                      {friend.firstName} {friend.lastName}
                    </span>
                  </div>
                </div>
                {friend.online ? (
                  <div className="home-wrapper_friends__list__item--online">
                    <div className="home-wrapper_friends__list__item--online--circle"></div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendsBar;
