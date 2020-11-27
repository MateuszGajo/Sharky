import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Card from "../Card/Card";
import axios from "@features/service/Axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiOutlineSearch } from "react-icons/ai";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import i18n from "@i18n";
import { uuid } from "uuidv4";
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
  const addText = t("component:lists.people.add");
  const deleteText = t("component:lists.people.delete");
  const acceptInvite = t("component:lists.people.accept");
  const declineInvite = t("component:lists.people.decline");
  const inviteSent = t("component:lists.people.sent");
  const emptyContent = t("component:lists.people.empty-content");
  const noResult = t("component:lists.people.no-result");

  const { setError, setPrompt, owner, socket } = useContext(AppContext);

  const [relation, setRelation] = useState({ id: null, name: "" });
  const [friends, setFriends] = useState([]);
  const [removeFriends, setRemoveFriend] = useState({});
  const [isMore, setStatusOfMore] = useState(false);
  const [declineInvitation, setDeclineInvitation] = useState({ id: null });

  const fetchData = (from) => {
    axios
      .post("/friend/get/people", { userId, from, keyWords, onlyFriends })
      .then(({ data: { friends: f, isMore } }) => {
        setFriends([...friends, ...f]);
        setStatusOfMore(isMore);
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
    const { userId } = declineInvitation;
    const newFriends = friends.filter((friend) => friend.userId != userId);
    setFriends(newFriends);
  }, [declineInvitation]);

  useEffect(() => {
    if (keyWords != null)
      axios
        .post("/friend/get/people", { userId, from: 0, keyWords, onlyFriends })
        .then(({ data: { friends, isMore } }) => {
          setFriends(friends);
          setStatusOfMore(isMore);
        });
  }, [keyWords]);

  useEffect(() => {
    const { setNumber, refId, setRefId, id } = removeFriends;
    if (refId)
      axios
        .post("/friend/delete", { userId: id })
        .then(() => {
          if (userId == owner.id) {
            const newFriends = friends.filter((item) => {
              return item.friendshipId != refId;
            });
            setFriends(newFriends);
          } else {
            setRefId(null);
            setNumber((prev) => prev - 1);
          }
        })
        .catch(({ response: { data: message } }) => setError(message));
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
            relation,
            userId: id,
            firstName,
            lastName,
            photo,
            numberOfFriends,
            isInvited,
            isInvitationSent,
          } = friend;

          const title = isInvited
            ? acceptInvite
            : isInvitationSent
            ? inviteSent
            : !relation
            ? addText
            : t(`component:lists.people.${relation}`);

          const data = {
            cardInfo: {
              id,
              refId: friendshipId,
              refType: "profile",
              photo,
              name: `${firstName + " " + lastName}`,
              description: description,
              number: numberOfFriends,
              radiusPhoto: false,
            },
            userStatus: {
              isInvited,
              isInvitationSent,
              relation,
            },
            collapse: {
              isCollapse: relation && userId == owner.id ? true : false,
              collapseItems: {
                pink: {
                  name: "pal",
                  title: palName,
                },
                blue: {
                  name: "family",
                  title: familyName,
                },
                green: {
                  name: "friend",
                  title: friendName,
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
              // handleClick={setFriend}
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

People.propTypes = {
  userId: PropTypes.number.isRequired,
  keyWords: PropTypes.string,
  onlySubscribed: PropTypes.bool,
  helpInformation: PropTypes.bool,
};

export default People;
