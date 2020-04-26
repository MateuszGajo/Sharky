import React,{useRef,useEffect,useState} from "react";
import cx from "classnames";


const FriendList = ({ listOfFriends=[
  {
  userId:234,
  relationShip:"rodzina"
},
{
  userId:345,
  relationShip:"znajomy"
},
{
  userId:456,
  relationShip:"przyjaciel"
}], users={
  234:{
    id:234,
    firstName:"Jan",
    lastName:"Kowalski",
    photo:"profile.png",
    amonutsOfFriends:123
  },
  345:{
    id:345,
    firstName:"Jan",
    lastName:"Kowalski",
    photo:"profile.png",
    amonutsOfFriends:543
  },
  456:{
    id:456,
    firstName:"Jan",
    lastName:"Kowalski",
    photo:"profile.png",
    amonutsOfFriends:54
  }} }) => {
  return (
    <div className="list">
      {listOfFriends.map((friend) => {
        const user = users[friend.userId];
        return (
          <div className="list__item" key={user.id}>
            <div className="list__item--picture">
              <img
                src={"/static/images/"+user.photo}
                className="list__item--picture--img"
                onClick={() => {
                  Router.pushRoute("profile", { id: user.id });
                }}
              />
            </div>
            <div className="list__item__info">
              <div className="list__item__info__first-column">
                <div className="list__item__info__first-column--name">
                  <span
                    className="list__item__info__first-column--name--span"
                    onClick={() => {
                      Router.pushRoute("profile", { id: user.id });
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="list__item__info__first-column--amounts-of-friends">
                  <span className="list__item__info__first-column--amounts-of-friends--span">
                    Liczba znajomych: {user.amonutsOfFriends}
                  </span>
                </div>
              </div>

              <div className="list__item__info__second-column">
               
                <div className="list__item__info__second-column--buttons">
                <div
                    className={cx("list__item__info__second-column--buttons--main-button white-color", {
                      "primary-background": friend.relationShip === "znajomy",
                      "family-background": friend.relationShip === "rodzina",
                      "pal-background": friend.relationShip === "przyjaciel",
                    })}
                  >
                    <span className="list__item__info__second-column--buttons--main-button--span">{friend.relationShip}</span>
                  </div>
                <div className="list__item__info__second-column--buttons--change-status">
                <div
                      className={cx(
                        "list__item__info__second-column--buttons--change-status--circle primary-background",
                        {
                          "brightness-reduce hover-brightness":
                            friend.relationShip !== "znajomy",
                        }
                      )}
                      onClick={() => {
                        if (friend.relationShip !== "znajomy") {
                          //save to db
                        }
                      }}
                    >
                      <span>Znajomy</span>
                    </div>
                    <div
                      className={cx(
                        "list__item__info__second-column--buttons--change-status--circle pal-background ",
                        {
                          "brightness-reduce hover-brightness":
                            friend.relationShip !== "przyjaciel",
                        }
                      )}
                      onClick={() => {
                        if (friend.relationShip !== "przyjaciel") {
                          //save to db
                        }
                      }}
                    >
                      <span>Przyjaciel</span>
                    </div>
                    <div
                      className={cx(
                        "list__item__info__second-column--buttons--change-status--circle family-background ",
                        {
                          "brightness-reduce hover-brightness":
                            friend.relationShip !== "rodzina",
                        }
                      )}
                      onClick={() => {
                        if (friend.relationShipd !== "rodzina") {
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
