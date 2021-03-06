import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { MdClose } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "~features/service/Axios";
import Search from "~common/Search/Search";
import Card from "~components/Lists/Card/Card";
import Spinner from "~components/Spinner/Spinner";
import AppContext from "~features/context/AppContext";
import i18next from "~i18n";

const { useTranslation } = i18next;

const InvitePerson = ({ isOpen, setStatusOfOpen, type, targetId }) => {
  const { t } = useTranslation();

  const { setError } = useContext(AppContext);
  const scrollBar = useRef(null);

  const [people, setPeople] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isScrolling, setStatusOfScrolling] = useState(false);
  const [isMore, setStatusOfMore] = useState(null);

  const emptyContent = t("common:pop-up.invite-person.empty-content");
  const description = t("component:lists.people.description");
  const inviteText = t("common:pop-up.invite-person.invite");

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

  const fetchData = (from, keyWords = "", prevState = people) => {
    axios
      .post("/people/get", { targetId, keyWords, from, type })
      .then(({ data: { friends, isMore: isMorePeople } }) => {
        setPeople([...prevState, ...friends]);
        setStatusOfMore(isMorePeople);
      })
      .catch(({ response: { message } }) => setError(message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(0, searchText, []);
  };

  useEffect(() => {
    scrollBar.current.addEventListener("wheel", showScroll);
    fetchData(0, searchText, []);
    return () => {
      scrollBar.current.removeEventListener("wheel", showScroll);
    };
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
          aria-hidden="true"
        >
          <MdClose />
        </div>
        <div className="invite-person__container__search">
          <form
            onSubmit={handleSubmit}
            className="invite-person__container__search__form"
          >
            <Search value={searchText} onChange={setSearchText} />
          </form>
        </div>
        {people.length ? (
          <div
            className={cx(
              "invite-person__container__people primary-scroll primary-scroll--margin",
              {
                "primary-scroll--active": isScrolling,
              }
            )}
            id="scroll"
          >
            <InfiniteScroll
              dataLength={people.length}
              next={() => fetchData(people.length, searchText)}
              hasMore={isMore}
              loader={<Spinner />}
              scrollableTarget="scroll"
            >
              {people.map((person) => {
                const {
                  userId,
                  firstName,
                  lastName,
                  photo,
                  numberOfFriends,
                  isInvitationSent,
                } = person;

                const data = {
                  cardInfo: {
                    id: userId,
                    refType: "profile",
                    refId: userId,
                    photo,
                    name: `${firstName} ${lastName}`,
                    description,
                    number: numberOfFriends,
                  },
                  userStatus: {
                    isInvitationSent,
                    invitePerson: {
                      type,
                      targetId,
                      title: inviteText,
                    },
                  },
                  collapse: {
                    isCollapse: false,
                  },
                };
                return (
                  <div
                    className="invite-person__container__people__item"
                    key={userId}
                  >
                    <Card data={data} />
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        ) : (
          <div className="invite-person__empty-content">
            <span className="invite-person__empty-content__text">
              {emptyContent}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

InvitePerson.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setStatusOfOpen: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  targetId: PropTypes.number.isRequired,
};

export default InvitePerson;
