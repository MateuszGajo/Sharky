import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "~features/service/Axios";
import Card from "~components/Lists/Card/Card";
import Spinner from "~components/Spinner/Spinner";
import AppContext from "~features/context/AppContext";
import i18next from "~i18n";

const { useTranslation } = i18next;

const Members = ({ fanpageId, role: permission }) => {
  const { t } = useTranslation(["fanpage"]);
  const adminName = t("fanpage:admin");
  const moderatorName = t("fanpage:moderator");
  const userName = t("fanpage:user");
  const mySelf = t("fanpage:my-self");
  const deleteText = t("component:lists.people.delete");

  const { owner, setError } = useContext(AppContext);

  const [members, setMembers] = useState([]);
  const [isMore, setStatusOfMore] = useState(null);
  const [removeMember, setRemoveMember] = useState({ id: null, idRef: null });
  const [relation, setRelation] = useState({});

  const fetchData = (from) => {
    axios
      .post("/fanpage/member/get", { fanpageId, from })
      .then(({ data: { members: m, isMore: isMoreFanpages } }) => {
        setMembers([...members, ...m]);
        setStatusOfMore(isMoreFanpages);
      });
  };

  useEffect(() => {
    const { id, refId } = removeMember;
    if (id) {
      axios
        .post("/fanpage/user/delete", { subId: id, fanpageId })
        .then(() => {
          const newArrayOfMembers = members.filter(
            (member) => member.userId !== refId
          );
          setMembers(newArrayOfMembers);
        })
        .catch(({ response: { message } }) => setError(message));
    }
  }, [removeMember]);

  useEffect(() => {
    const { id, name, setTitle } = relation;

    if (id) {
      axios
        .post("/fanpage/member/relation/change", {
          subId: id,
          fanpageId,
          relation: name,
        })
        .then(() => {
          setTitle(name);
        })
        .catch(({ response: { message } }) => setError(message));
    }
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
              cardInfo: {
                id: subId,
                refId: userId,
                refType: "profile",
                photo,
                radiusPhoto: false,
                name: `${firstName} ${lastName} ${
                  owner.id === userId ? `(${mySelf})` : ""
                }`,
              },
              userStatus: {
                relation: role,
              },
              texts: {
                deleteText,
              },
              collapse: {
                isCollapse: permission === "admin" && owner.id !== userId,
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
              },
            };
            return (
              <Card
                data={data}
                handleCollapseClick={setRemoveMember}
                setRelation={setRelation}
                key={userId}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

Members.propTypes = {
  fanpageId: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired,
};

export default Members;
