import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "@components/Lists/Card/Card";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
const { useTranslation } = i18next;

const Members = ({ idFanpage, role: permission }) => {
  const { t } = useTranslation(["fanpage"]);
  const adminName = t("fanpage:admin");
  const moderatorName = t("fanpage:moderator");
  const userName = t("fanpage:user");
  const mySelf = t("fanpage:my-self");
  const removeText = t("component:lists.people.remove");

  const { owner, setError } = useContext(AppContext);

  const [members, setMembers] = useState([]);
  const [isMore, setStatusOfMore] = useState(null);
  const [removeMember, setRemoveMember] = useState({ id: null, idRef: null });
  const [relation, setRealation] = useState({});

  const fetchData = (from) => {
    axios
      .post("/fanpage/member/get", { idFanpage, from })
      .then(({ data: { members: m, isMore } }) => {
        setMembers([...members, ...m]);
        setStatusOfMore(isMore);
      });
  };

  useEffect(() => {
    const { id, idRef } = removeMember;
    if (id) {
      axios
        .post("/fanpage/user/delete", { idSub: id })
        .then(() => {
          const newArrayOfMembers = members.filter(
            (member) => member.idUser != idRef
          );
          setMembers(newArrayOfMembers);
        })
        .catch(({ response: { message } }) => setError(message));
    }
  }, [removeMember]);

  useEffect(() => {
    const { idSub, name, setButtonName, setTitle } = relation;
    if (idSub)
      axios
        .post("/fanpage/member/relation/change", { idSub, relation: name })
        .then(() => {
          setButtonName(name);
          setTitle(t(`fanpage:${name}`));
        })
        .catch(({ response: { message } }) => setError(message));
  }, [relation]);

  useEffect(() => {
    fetchData(0);
  }, []);
  return (
    <div className="fanpage-members">
      {console.log(members)}
      <InfiniteScroll
        dataLength={members.length}
        next={() => fetchData(members.length)}
        hasMore={isMore}
        loader={<Spinner />}
      >
        {members.map((member) => {
          const { idUser, idSub, role, firstName, lastName, photo } = member;
          const data = {
            refType: "profile",
            id: idSub,
            idRef: idUser,
            photo,
            radiusPhoto: false,
            name: `${firstName} ${lastName} ${
              owner.id == idUser ? `(${mySelf})` : ""
            }`,
            unsubTitle: removeText,
            button: "relation",
            buttonName: role,
            title: t(`fanpage:${role}`),
            collapse:
              permission == "admin" && owner.id != idUser ? true : false,
            collapseItems: {
              pink: {
                name: "admin",
                title: adminName,
              },
              blue: {
                name: "moderator",
                title: moderatorName,
              },
              green: {
                name: "user",
                title: userName,
              },
            },
          };
          return (
            <Card
              data={data}
              handleClick={setRemoveMember}
              setRelation={setRealation}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Members;
