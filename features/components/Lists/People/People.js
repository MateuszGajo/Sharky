import React, { useState, useEffect, useContext } from "react";
import Card from "../Card/Card";
import axios from "axios";
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
  const [friend, setFriend] = useState({ id: null, name: "", refId: null });
  const [isMore, setStatusOfMore] = useState(false);
  const [invite, setInvite] = useState({ inviteType: "", idRelation: null });

  const fetchData = (from) => {
    axios
      .post("/friend/get/people", { userId, from, keyWords, onlyFriends })
      .then(({ data: { friends: f, isMore } }) => {
        setFriends([...friends, ...f]);
        setStatusOfMore(isMore);
      });
  };

  useEffect(() => {
    const { id, subId } = relation;
    if (id != null) {
      setPrompt(changeRelationText);
      axios
        .post("/friend/update/relation", {
          friendshipId: id,
          userId: subId,
          relation: relation.name,
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
  }, [relation]);

  useEffect(() => {
    const {
      invitationType,
      setButtonType,
      setTitle,
      friendshipId,
      setCollapse,
      setButtonName,
      number,
      setNumber,
      setStatusOfInvited,
    } = invite;
    if (invitationType == "accept")
      axios
        .post("/friend/accept", { friendshipId })
        .then(({ data: { chatId, relation, success } }) => {
          if (success) {
            setButtonType("relation");
            setStatusOfInvited(false);
            setTitle(t(`component:lists.people.${relation}`));
            setButtonName(relation);
            setCollapse(userId == owner.id && relation ? true : false);
            setNumber(Number(number) + 1);
            socket.emit("joinNewChat", { friendshipId, chatId });
          } else {
            setButtonType("relation");
            setStatusOfInvited(false);
            setTitle(t(`component:lists.people.${relation}`));
            setButtonName(relation);
            setCollapse(userId == owner.id && relation ? true : false);
            setNumber(Number(number) + 1);
            setFriends(newFriends);
          }
        })
        .catch(({ response: { data: message } }) => setError(message));

    if (invitationType == "decline") {
      axios
        .post("/friend/decline", { friendshipId })
        .then(() => {
          const newFriends = friends.filter((friend) => {
            return friend.friendshipId != friendshipId;
          });
          setFriends(newFriends);
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
  }, [invite]);

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
    const {
      setNumber,
      number,
      refId,
      setRefId,
      id,
      setStatusOfInvitation,
    } = friend;
    if (refId)
      axios
        .post("/friend/delete", { friendshipId: friend.refId })
        .then(() => {
          if (userId == owner.id) {
            const newFriends = friends.filter((item) => {
              return item.friendshipId != friend.refId;
            });
            setFriends(newFriends);
          } else {
            setRefId(null);
            setNumber(Number(number) - 1);
          }
        })
        .catch(({ response: { data: message } }) => setError(message));
    else if (id)
      axios
        .post("/friend/add", { userId: id })
        .then(() => {
          setStatusOfInvitation(true);
        })
        .catch(({ response: { data: message } }) => setError(message));
  }, [friend]);

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
            id,
            refId: friendshipId,
            refType: "profile",
            photo,
            isInvited,
            isInvitationSent,
            radiusPhoto: false,
            name: `${firstName + " " + lastName}`,
            description: description,
            number: numberOfFriends,
            buttonType: relation ? "relation" : "join",
            title,
            secondTitle: isInvited && declineInvite,
            deleteText,
            buttonName: relation,
            collapse: relation && userId == owner.id ? true : false,
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
          };
          return (
            <Card
              data={data}
              key={id}
              setRelation={setRelation}
              handleClick={setFriend}
              setInvite={setInvite}
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

export default People;
