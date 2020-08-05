import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "@components/Lists/Card/Card";
import Spinner from "@components/Spinner/Spinner";
import i18next from "@i18n";
const { useTranslation } = i18next;

const Members = ({ idFanpage }) => {
  const { t } = useTranslation(["fanpage"]);
  const administratorName = t("fanpage:administrator");
  const moderatorName = t("fanpage:moderator");
  const userName = t("fanpage:user");

  const [members, setMembers] = useState([]);
  const [isMore, setStatusOfMore] = useState(null);

  const fetchData = (from) => {
    axios
      .post("/fanpage/member/get", { idFanpage, from })
      .then(({ data: { members: m, isMore } }) => {
        setMembers([...members, ...m]);
        setStatusOfMore(isMore);
      });
  };

  useEffect(() => {
    fetchData(0);
  }, []);
  return (
    <div className="fanpage-members">
      <InfiniteScroll
        dataLength={members.length} //This is important field to render the next data
        next={() => fetchData(members.length)}
        hasMore={isMore}
        loader={<Spinner />}
      >
        {members.map((member) => {
          const { idUser, role, firstName, lastName, photo } = member;
          const data = {
            refType: "profile",
            idRef: idUser,
            photo,
            radiusPhoto: false,
            name: `${firstName} ${lastName}`,
            button: "relation",
            buttonName: role,
            title: t(`fanpage:${role}`),
            collapse: false,
            collapseItems: {
              pink: {
                name: "administrator",
                title: administratorName,
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
          return <Card data={data} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Members;
