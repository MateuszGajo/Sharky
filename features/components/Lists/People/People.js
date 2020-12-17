import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AiOutlineSearch } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "~features/service/Axios";
import Card from "../Card/Card";
import Spinner from "~components/Spinner/Spinner";
import AppContext from "~features/context/AppContext";
import i18n from "~i18n";

const { useTranslation } = i18n;

const People = ({
  userId,
  keyWords = "",
  onlyFriends = false,
  helpInformation = true,
}) => {
  const { t } = useTranslation(["component"]);

  const changeRelationText = t("component:lists.people.relation-change");
  const description = t("component:lists.people.description");
  const friendName = t("component:lists.people.friend");
  const familyName = t("component:lists.people.family");
  const palName = t("component:lists.people.pal");
  const deleteText = t("component:lists.people.delete");
  const emptyContent = t("component:lists.people.empty-content");
  const noResult = t("component:lists.people.no-result");
  const yourself = t("component:lists.people.yourself");
  const { setError, setPrompt, owner } = useContext(AppContext);

  const [relation, setRelation] = useState({ id: null, name: "" });
  const [friends, setFriends] = useState([]);
  const [removeFriends, setRemoveFriend] = useState({});
  const [isMore, setStatusOfMore] = useState(false);
  const [declineInvitation, setDeclineInvitation] = useState({ id: null });

  const fetchData = (from) => {
    axios
      .post("/friend/get/people", { userId, from, keyWords, onlyFriends })
      .then(({ data: { friends: f, isMorePeople } }) => {
        setFriends([...friends, ...f]);
        setStatusOfMore(isMorePeople);
      });
  };

  useEffect(() => {
    const { id } = relation;
    if (id != null) {
      setPrompt(changeRelationText);
      axios
        .post("/friend/update/relation", {
          userId: id,
          relation: relation.name,
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
  }, [relation]);

  useEffect(() => {
    const { uId } = declineInvitation;
    if (uId) {
      const newFriends = friends.filter((friend) => friend.userId !== uId);
      setFriends(newFriends);
    }
  }, [declineInvitation]);

  useEffect(() => {
    if (keyWords != null) {
      axios
        .post("/friend/get/people", { userId, from: 0, keyWords, onlyFriends })
        .then(({ data: { friends: initialFriends, isMoreFriends } }) => {
          setFriends(initialFriends);
          setStatusOfMore(isMoreFriends);
        });
    }
  }, [keyWords]);

  useEffect(() => {
    const { setNumber, subId, setSubId, id } = removeFriends;
    if (subId) {
      axios
        .post("/friend/delete", { userId: id })
        .then(() => {
          if (userId === owner.id) {
            const newFriends = friends.filter(
              (item) => item.friendshipId !== subId
            );
            setFriends(newFriends);
          } else {
            setSubId(null);
            setNumber((prev) => prev - 1);
          }
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
  }, [removeFriends]);

  useEffect(() => {
    fetchData(0);
  }, []);

  return (
    <InfiniteScroll
      dataLength={friends.length}
      next={() => fetchData(friends.length)}
      hasMore={isMore}
      loader={<Spinner />}
    >
      <div className="list">
        {friends.map((friend) => {
          const {
            friendshipId,
            relation: userRelation,
            userId: id,
            firstName,
            lastName,
            photo,
            numberOfFriends,
            isInvited,
            isInvitationSent,
          } = friend;

          const data = {
            cardInfo: {
              id,
              refId: id,
              subId: friendshipId,
              refType: "profile",
              photo,
              name: `${`${firstName} ${lastName}`}`,
              description,
              number: numberOfFriends,
              radiusPhoto: false,
              noButton: id === owner.id,
              textInsteadButton: yourself,
            },
            userStatus: {
              isInvited,
              isInvitationSent,
              relation: userRelation,
            },
            collapse: {
              isCollapse: userRelation && userId === owner.id,
              collapseItems: {
                pink: {
                  name: "friend",
                  title: friendName,
                },
                blue: {
                  name: "family",
                  title: familyName,
                },
                green: {
                  name: "pal",
                  title: palName,
                },
              },
            },
            texts: {
              deleteText,
            },
          };
          return (
            <Card
              data={data}
              key={id}
              setRelation={setRelation}
              handleCollapseClick={setRemoveFriend}
              setDeclineInvitation={keyWords ? setDeclineInvitation : null}
            />
          );
        })}
      </div>
      {!friends.length && helpInformation && (
        <div className="empty-card">
          <div className="empty-card__icon">
            <AiOutlineSearch />
          </div>
          <div className="empty-card__text">
            <span className="empty-card__text__span">
              {keyWords ? noResult : emptyContent}
            </span>
          </div>
        </div>
      )}
    </InfiniteScroll>
  );
};

People.defaultProps = {
  keyWords: "",
  onlyFriends: false,
  helpInformation: true,
};

People.propTypes = {
  userId: PropTypes.number.isRequired,
  onlyFriends: PropTypes.bool,
  keyWords: PropTypes.string,
  helpInformation: PropTypes.bool,
};

export default People;
