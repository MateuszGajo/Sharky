import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";

const Navbar = ({
  setStatusOfDisplayMobile,
  setStatusOfMessenger,
  user,
  windowMessenger,
  setChat,
}) => {
  return (
    <div className="messenger__navbar">
      <div
        className="messenger__navbar__return"
        onClick={() => setStatusOfDisplayMobile(false)}
      >
        <IoMdArrowBack />
      </div>
      <div className="messenger__navbar__person">
        <div className="messenger__navbar__person__photo">
          <img
            src={"/static/images/" + user.photo}
            alt=""
            className="messenger__navbar__person__photo--img"
          />
        </div>

        <div className="messenger__navbar__person--name">
          <span className="messenger__navbar__person--name--text">
            {user.firstName + " " + user.lastName}
          </span>
        </div>
      </div>
      {windowMessenger ? (
        <div className="messenger__navbar__icons">
          <div
            className="messenger__navbar__icons--icon"
            onClick={() => {
              setChat({ idChat: null, user: null });
              setStatusOfMessenger(true);
            }}
            data-testid="messenger-close"
          >
            <AiOutlineClose />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
