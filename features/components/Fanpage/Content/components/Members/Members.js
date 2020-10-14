import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "@components/Lists/Card/Card";
import Spinner from "@components/Spinner/Spinner";
import AppContext from "@features/context/AppContext";
import i18next from "@i18n";
const { useTranslation } = i18next;

const Members = ({ fanpageId, role: permission }) => {
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
      .post("/fanpage/member/get", { fanpageId, from })
      .then(({ data: { members: m, isMore } }) => {
        setMembers([...members, ...m]);
        setStatusOfMore(isMore);
      });
  };

  useEffect(() => {
    const { id, idRef } = removeMember;
    if (id) {
      axios
        .post("/fanpage/user/delete", { subId: id })
        .then(() => {
          const newArrayOfMembers = members.filter(
            (member) => member.userId != idRef
          );
          setMembers(newArrayOfMembers);
        })
        .catch(({ response: { message } }) => setError(message));
    }
  }, [removeMember]);

  useEffect(() => {
    const { subId, name, setButtonName, setTitle } = relation;
    if (subId)
      axios
        .post("/fanpage/member/relation/change", { subId, relation: name })
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
    <div className="fanpage__content__members">
      <InfiniteScroll
        dataLength={members.length}
        next={() => fetchData(members.length)}
        hasMore={isMore}
        loader={<Spinner />}
      >
        <div className="fanpage__content__members__container">
          {members.map((member) => {
            const { userId, subId, role, firstName, lastName, photo } = member;
            const data = {
              id: subId,
              refId: userId,
              refType: "profile",
              photo,
              radiusPhoto: false,
              name: `${firstName} ${lastName} ${
                owner.id == userId ? `(${mySelf})` : ""
              }`,
              unsubTitle: removeText,
              button: "relation",
              buttonName: role,
              title: t(`fanpage:${role}`),
              collapse:
                permission == "admin" && owner.id != userId ? true : false,
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
                key={userId}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Members;
