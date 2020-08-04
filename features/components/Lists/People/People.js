import React, { useState, useEffect, useContext } from "react";
import Card from "../Card/Card";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import i18n from "@i18n";
const { useTranslation } = i18n;

const People = ({ idUser, keyWords = "" }) => {
  const { t } = useTranslation(["component"]);

  const relationChangeText = t("component:lists.people.relation-change");
  const description = t("component:lists.people.description");
  const friendName = t("component:lists.people.friend");
  const familyName = t("component:lists.people.family");
  const palName = t("component:lists.people.pal");
  const addText = t("component:lists.people.add");
  const removeText = t("component:lists.people.remove");
  const acceptInvite = t("component:lists.people.accept");
  const declineInvite = t("component:lists.people.decline");
  const sentInvite = t("component:lists.people.sent");

  const { setError, setPrompt, owner } = useContext(AppContext);
  const [relation, setRelation] = useState({ id: null, name: "" });
  const [friends, setFriends] = useState([]);
  const [friend, setFriend] = useState({ id: null, name: "", idRef: null });
  const [isMore, setStatusOfMore] = useState(false);
  const [invite, setInvite] = useState({ inviteType: "", idRelation: null });

  const fetchData = (from) => {
    axios
      .post("/friend/get/people", { idUser, from, keyWords })
      .then(({ data: { friends: f, isMore } }) => {
        setFriends([...friends, ...f]);
        setStatusOfMore(isMore);
      });
  };

  useEffect(() => {
    const { idFriendShip } = relation;
    if (idFriendShip != null) {
      setPrompt(relationChangeText);
      axios
        .post("/friend/update/relation", {
          idFriendShip,
          idUser,
          relation: relation.name,
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
  }, [relation]);

  useEffect(() => {
    const {
      inviteType,
      setInviteType,
      setButton,
      setTitle,
      idFriendShip,
      setCollapse,
      setButtonName,
      number,
      setNumber,
    } = invite;

    if (inviteType == "accept")
      axios
        .post("/friend/accept", { idFriendShip })
        .then(({ data: { relation } }) => {
          setInviteType("");
          setButton("relation");
          setTitle(t(`component:lists.people.${relation}`));
          setButtonName(relation);
          setCollapse(idUser == owner.id && relation ? true : false);
          setNumber(Number(number) + 1);
        })
        .catch(({ response: { data: message } }) => setError(message));

    if (inviteType == "decline") {
      axios
        .post("/friend/decline", { idFriendShip })
        .then(() => {
          const newFriends = friends.filter((friend) => {
            return friend.idFriendShip != idFriendShip;
          });
          setFriends(newFriends);
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
  }, [invite]);

  useEffect(() => {
    if (keyWords != null)
      axios
        .post("/friend/get/people", { idUser, from: 0, keyWords })
        .then(({ data: { friends, isMore } }) => {
          setFriends(friends);
          setStatusOfMore(isMore);
        });
  }, [keyWords]);

  useEffect(() => {
    const {
      setNumber,
      number,
      idRef,
      setIdRef,
      id,
      setStatusOfInvitation,
    } = friend;
    if (idRef)
      axios
        .post("/friend/remove", { idFriendShip: friend.idRef })
        .then(() => {
          if (idUser == owner.id) {
            const newFriends = friends.filter((item) => {
              return item.idFriendShip != friend.idRef;
            });
            setFriends(newFriends);
          } else {
            setIdRef(null);
            setNumber(Number(number) - 1);
          }
        })
        .catch(({ response: { data: message } }) => setError(message));
    else if (id)
      axios
        .post("/friend/add", { idUser: id })
        .then(({ data: { idFriendShip: id } }) => {
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
            idFriendShip,
            relation,
            idUser: id,
            firstName,
            lastName,
            photo,
            numberOfFriends,
            isInvited,
            isInvitationSent,
          } = friend;

          const data = {
            ref: "profile",
            id,
            idRef: idFriendShip,
            subTitle: addText,
            unsubTitle: removeText,
            photo,
            isInvited,
            isInvitationSent,
            radiusPhoto: false,
            name: `${firstName + " " + lastName}`,
            description: description,
            number: numberOfFriends,
            acceptInvite,
            declineInvite,
            sentInvite,
            button: relation ? "relation" : "join",
            title: t(`component:lists.people.${relation}`),
            buttonName: relation,
            collapse: relation && idUser == owner.id ? true : false,
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
    </InfiniteScroll>
  );
};

export default People;
