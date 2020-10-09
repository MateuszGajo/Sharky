import React, { useState, useRef, useEffect, useContext } from "react";
import cx from "classnames";
import { MdClose } from "react-icons/md";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Search from "@common/Search/Search";
import Card from "@components/Lists/Card/Card";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
const { useTranslation } = i18next;

const InvitePerson = ({ isOpen = true, setStatusOfOpen, type, targetId }) => {
  const { t } = useTranslation();

  const { setError } = useContext(AppContext);
  const scrollBar = useRef(null);

  const [people, setPeople] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isScrolling, setStatusOfScrolling] = useState(false);
  const [invite, setInvite] = useState({ refId: null });
  const [isMore, setStatusOfMore] = useState(null);

  const emptyContent = t("common:pop-up.invite-person.empty-content");
  const description = t("component:lists.people.description");
  const inviteText = t("common:pop-up.invite-person.invite");
  const inviteSent = t("component:lists.people.sent");

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
      .then(({ data: { friends, isMore } }) => {
        setPeople([...prevState, ...friends]);
        setStatusOfMore(isMore);
      })
      .catch(({ response: { message } }) => setError(message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(0, searchText, []);
  };

  useEffect(() => {
    const { refId, setStatusOfInvitation } = invite;
    if (refId) {
      axios
        .post(`/${type}/user/invite`, { userId: refId, targetId })
        .then(() => setStatusOfInvitation(true))
        .catch(({ response: { message } }) => setError(message));
    }
  }, [invite]);

  useEffect(() => {
    scrollBar.current.addEventListener("wheel", showScroll);
    fetchData(0, searchText, []);
    return () => {
      removeEventListener("wheel", showScroll);
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
              scrollableTarget={"scroll"}
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
                  refType: "profile",
                  refId: userId,
                  photo: photo,
                  isInvitationSent,
                  inviteSent,
                  name: `${firstName} ${lastName}`,
                  title: inviteText,
                  description,
                  number: numberOfFriends,
                  button: "join",
                };
                return (
                  <div className="invite-person__container__people__item">
                    <Card data={data} handleClick={setInvite} />
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

export default InvitePerson;
