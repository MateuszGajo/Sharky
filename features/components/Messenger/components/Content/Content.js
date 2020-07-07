import React, { useState, useContext } from "react";
import Router from "../../../../route/routes";
import AppContext from "../../../../context/AppContext";
// import { ConsoleView } from "react-device-detect";

const Content = ({ messages, user }) => {
  const { owner } = useContext(AppContext);

  return (
    <div className="messenger__text" data-testid="messenger-chat">
      {messages.map((message, index) => {
        const addAuthor =
          index + 1 === messages.length ||
          messages[index + 1].idUser !== message.idUser;

        return message.idUser === owner.id ? (
          <div className="messenger__text--myself" key={index}>
            <span className="messenger__text--myself--primary-color messenger-text-style">
              {message.message}
            </span>
          </div>
        ) : (
          <div className="messenger__text--stranger" key={index}>
            <span className="messenger__text--stranger--primary-background-color messenger-text-style">
              {message.message}
            </span>
            {addAuthor ? (
              <div className="messenger__text--stranger__user">
                <div
                  className="messenger__text--stranger__user__container"
                  title={user.firstName + " " + user.lastName}
                  onClick={() =>
                    Router.pushRoute("profile", { id: message.idUser })
                  }
                >
                  <div className="messenger__text--stranger__user__container__photo">
                    <img
                      src={"/static/images/" + user.photo}
                      alt=""
                      className="messenger__text--stranger__user__container__photo--img"
                    />
                  </div>
                  <div className="messenger__text--stranger__user__container__name">
                    <span className="messenger__text--stranger__user__container__name--span">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default Content;
