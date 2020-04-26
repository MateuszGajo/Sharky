import React,{useRef,useEffect,useState} from "react";
import cx from "classnames";


const FriendList = ({ listOfFriends, users,numberUserOfRow=1 }) => {
  const friendShip = useRef(null);
  const [isInvisible, setStatusOfVisiblity] = useState(true)

  const displayChangeStatus =()=> {
    console.log("ds")
  }

  useEffect(()=>{
    friendShip.current.addEventListener("mouseout",displayChangeStatus)
  },[])
  return (
    <div className="friends">
      {listOfFriends.map((friend) => {
        const user = users[friend.userId];
        return (
          <div className={cx("friends__item",{
            "friends__item--large":numberUserOfRow === 1,
            "friends__item--medium":numberUserOfRow === 2,
            "friends__item--small":numberUserOfRow === 3,
          })} key={user.id}>
            <div className="friends__item--picture">
              <img
                src="/static/images/profile.png"
                className="friends__item--picture--img"
                onClick={() => {
                  Router.pushRoute("profile", { id: user.id });
                }}
              />
            </div>
            <div className="friends__item__info">
              <div className="friends__item__info__first-column">
                <div className="friends__item__info__first-column--name">
                  <span
                    className="friends__item__info__first-column--name--span"
                    onClick={() => {
                      Router.pushRoute("profile", { id: user.id });
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="friends__item__info__first-column--amounts-of-friends">
                  <span className="friends__item__info__first-column--amounts-of-friends--span">
                    Liczba znajomych: {user.amonutsOfFriends}
                  </span>
                </div>
              </div>

              <div className="friends__item__info__second-column">
               
                <div className="friends__item__info__second-column--status">
                <div
                  ref={friendShip}
                    className={cx("friends__item__info__second-column--status--now", {
                      "primary-background": friend.relationShip === "Znajomy",
                      "family-background": friend.relationShip === "Rodzina",
                      "pal-background": friend.relationShip === "Przyjaciel",
                    })}
                  >
                    <span>{friend.relationShip}</span>
                  </div>
                <div className="friends__item__info__second-column--status--change-status">
                <div
                      className={cx(
                        "friends__item__info__second-column--status--change-status--circle primary-background",
                        {
                          "brightness-reduce hover-brightness":
                            friend.relationShip !== "Znajomy",
                        }
                      )}
                      onClick={() => {
                        if (friend.relationShip !== "Znajomy") {
                          //save to db
                        }
                      }}
                    >
                      <span>Znajomy</span>
                    </div>
                    <div
                      className={cx(
                        "friends__item__info__second-column--status--change-status--circle pal-background ",
                        {
                          "brightness-reduce hover-brightness":
                            friend.relationShip !== "Przyjaciel",
                        }
                      )}
                      onClick={() => {
                        if (friend.relationShip !== "Przyjaciel") {
                          //save to db
                        }
                      }}
                    >
                      <span>Przyjaciel</span>
                    </div>
                    <div
                      className={cx(
                        "friends__item__info__second-column--status--change-status--circle family-background ",
                        {
                          "brightness-reduce hover-brightness":
                            friend.relationShip !== "Rodzina",
                        }
                      )}
                      onClick={() => {
                        if (friend.relationShipd !== "Rodzina") {
                          //save to db
                        }
                      }}
                    >
                      <span>Rodzina</span>
                    </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FriendList;
