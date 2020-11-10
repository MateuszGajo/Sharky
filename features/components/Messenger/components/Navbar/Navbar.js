import React from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { AiOutlineClose } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";

const Navbar = ({
  setStatusOfDisplayMobile,
  setStatusOfMessenger,
  user,
  windowMessenger,
  setChat,
}) => {
  const { id, firstName, lastName, photo } = user;
  return (
    <div className="messenger__navbar">
      <div className="messenger__navbar__left">
        <div
          className="messenger__navbar__left__return"
          onClick={() => setStatusOfDisplayMobile(false)}
        >
          <IoMdArrowBack />
        </div>
        <div
          className="messenger__navbar__left__person"
          onClick={() => Router.push(`/profile/${id}`)}
        >
          <div className="messenger__navbar__left__person__photo">
            <img
              src={"/static/images/" + photo}
              alt=""
              className="messenger__navbar__left__person__photo__img"
            />
          </div>

          <div className="messenger__navbar__left__person__name">
            <span className="messenger__navbar__left__person__name__text">
              {firstName + " " + lastName}
            </span>
          </div>
        </div>
      </div>
      {windowMessenger ? (
        <div className="messenger__navbar__right">
          <div className="messenger__navbar__right__icons">
            <div
              className="messenger__navbar__right__icons__icon"
              onClick={() => {
                setChat({ chatId: null, user: null });
                setStatusOfMessenger(true);
              }}
              data-testid="messenger-close"
            >
              <AiOutlineClose />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
