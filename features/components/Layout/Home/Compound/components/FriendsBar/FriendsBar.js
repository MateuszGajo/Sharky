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
  const friendLists = [
    { firstName: "Janek", lastName: "Kowalski", online: true, id: 1 },
    { firstName: "Janek", lastName: "Kowalski", online: false, id: 2 },
  ];

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
          {friendLists.map((friend) => {
            return (
              <div
                className="home-wrapper_friends__list__item"
                key={friend.id}
                data-testid={`friend${friend.id}`}
                onClick={() => setStatusOfMessage(true)}
              >
                {friend.online ? (
                  <div className="home-wrapper_friends__list__item--online"></div>
                ) : null}
                <div
                  className={cx("home-wrapper_friends__list__item--icon", {
                    "home-wrapper_friends__list__item--icon--active":
                      friend.online,
                  })}
                >
                  <FaUserCircle />
                </div>
                <div className="home-wrapper_friends__list__item--name">
                  {friend.firstName} {friend.lastName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendsBar;
