import React from "react";

const FanpageList = ({
  listOfFanPage = [
    {
      id: 1,
      name: "dassa",
      photo: "profile.png",
      numberOfLikes: 123,
    },
    {
      id: 2,
      name: "dassa",
      photo: "profile.png",
      numberOfLikes: 123,
    },
    {
      id: 3,
      name: "dassa",
      photo: "profile.png",
      numberOfLikes: 123,
    },
  ],
}) => {
  return (
    <div className="list">
      {listOfFanPage.map((fanpage) => {
        return (
          <div className="list__item" key={fanpage.id}>
            <div className="list__item--picture">
              <img
                src={"/static/images/" + fanpage.photo}
                className="list__item--picture--img image-radius"
                onClick={() => {
                  Router.pushRoute("fanpage", { id: fanpage.id });
                }}
              />
            </div>
            <div className="list__item__info">
              <div className="list__item__info__first-column">
                <div className="list__item__info__first-column--name">
                  <span
                    className="list__item__info__first-column--name--span"
                    onClick={() => {
                      Router.pushRoute("fanpage", { id: fanpage.id });
                    }}
                  >
                    {fanpage.name}
                  </span>
                </div>
                <div className="list__item__info__first-column--amounts-of-friends">
                  <span className="list__item__info__first-column--amounts-of-friends--span">
                    Liczba Subskrybcji: {fanpage.numberOfLikes}
                  </span>
                </div>
              </div>
              <div className="list__item__info__second-column">
                <div className="list__item__info__second-column--buttons">
                  <div className="list__item__info__second-column--buttons--main-button button-join">
                    <span>Subskrybuj</span>
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

export default FanpageList;
