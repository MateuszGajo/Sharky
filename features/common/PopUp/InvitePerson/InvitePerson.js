import React, { useState, useRef, useEffect } from "react";
import cx from "classnames";
import { MdClose } from "react-icons/md";
import Search from "../../Search/Search";
import Card from "../../../components/Lists/Card/Card";

const InvitePerson = ({ isOpen = true, setStatusOfOpen }) => {
  const people = [
    {
      id: 123,
      firstName: "Jan",
      lastName: "Kowalski",
      photo: "profile.png",
    },
    {
      id: 123,
      firstName: "Konrad",
      lastName: "Walczak",
      photo: "profile.png",
    },
  ];

  const scrollBar = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [isScrolling, setStatusOfScrolling] = useState(false);

  let navTimeout = null;

  const showScroll = () => {
    if (navTimeout) {
      clearTimeout(navTimeout);
    }
    setStatusOfScrolling(true);

    navTimeout = setTimeout(() => {
      setStatusOfScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    scrollBar.current.addEventListener("wheel", showScroll);
  }, []);
  return (
    <section
      className={cx("invite-person", {
        "invite-person--close": !isOpen,
      })}
    >
      <div className="invite-person__container" ref={scrollBar}>
        <div
          className="invite-person__container__close-icon"
          onClick={() => setStatusOfOpen(false)}
        >
          <MdClose />
        </div>
        <div className="invite-person__container__search">
          <Search value={searchText} onChange={setSearchText} />
        </div>
        <div
          className={cx("invite-person__container__people primary-scroll", {
            "primary-scroll-active": isScrolling,
          })}
        >
          {people.map((person) => {
            const { id, firstName, lastName, photo } = person;
            const data = {
              refType: "profile",
              refId: id,
              photo: photo,
              name: `${firstName} ${lastName}`,
              title: "Zaproś",
              button: "join",
            };
            return (
              <div className="invite-person__container__people__item">
                <Card data={data} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InvitePerson;
