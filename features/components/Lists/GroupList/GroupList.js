import React from "react";

const GroupList = ({
  listOfGroups = [
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
    {
      id: 12,
      name: "dsa",
      photo: "profile.png",
      numberOfMembers: 123,
    },
  ],
}) => {
  return (
    <div className="list">
      {listOfGroups.map((group) => {
        return (
          <div className="list__wrapper">
            <div className="list__wrapper__item" key={group.id}>
              <div className="list__wrapper__item--picture">
                <img
                  src={"/static/images/" + group.photo}
                  className="list__wrapper__item--picture--img image-radius"
                  onClick={() => {
                    Router.pushRoute("group", { id: group.id });
                  }}
                />
              </div>
              <div className="list__wrapper__item__info">
                <div className="list__wrapper__item__info__first-column">
                  <div className="list__wrapper__item__info__first-column--name">
                    <span
                      className="list__wrapper__item__info__first-column--name--span"
                      onClick={() => {
                        Router.pushRoute("group", { id: group.id });
                      }}
                    >
                      {group.name}
                    </span>
                  </div>
                  <div className="list__wrapper__item__info__first-column--amounts-of-friends">
                    <span className="list__wrapper__item__info__first-column--amounts-of-friends--span">
                      Liczba osób: {group.numberOfMembers}
                    </span>
                  </div>
                </div>
                <div className="list__wrapper__item__info__second-column">
                  <div className="list__wrapper__item__info__second-column--buttons">
                    <div className="list__wrapper__item__info__second-column--buttons--main-button button-join">
                      <span>Dołącz</span>
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

export default GroupList;
