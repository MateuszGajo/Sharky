import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "~features/service/Axios";
import Card from "../Card/Card";
import i18next from "~i18n";
import AppContext from "~features/context/AppContext";
import Spinner from "~components/Spinner/Spinner";

const { useTranslation } = i18next;

const Groups = ({
  userId,
  keyWords = "",
  onlySubscribed = false,
  helpInformation = true,
}) => {
  const { t } = useTranslation(["component"]);
  const description = t("component:lists.groups.description");
  const joinText = t("component:lists.groups.join");
  const leaveText = t("component:lists.groups.leave");
  const emptyContent = t("component:lists.groups.empty-content");
  const noResult = t("component:lists.groups.no-result");

  const { owner, setError } = useContext(AppContext);

  const [group, setGroup] = useState({ id: null, name: "", subId: null });
  const [groups, setGroups] = useState([]);
  const [isMore, setStatusOfMore] = useState();

  const fetchData = (from) => {
    axios
      .post("/group/get", { from, userId, keyWords, onlySubscribed })
      .then(({ data: { groups: g, isMoreGroups } }) => {
        setGroups([...groups, ...g]);
        setStatusOfMore(isMoreGroups);
      })
      .catch(({ response: { data: message } }) => setError(message));
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  useEffect(() => {
    if (keyWords != null) {
      axios
        .post("/group/get", { from: 0, userId, keyWords, onlySubscribed })
        .then(({ data: { initialGroups, isMoreGroups } }) => {
          setGroups(initialGroups);
          setStatusOfMore(isMoreGroups);
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
  }, [keyWords]);

  useEffect(() => {
    const { setNumber, refId, setRefId, id } = group;
    if (refId) {
      axios
        .post("/group/leave", { groupId: id })
        .then(() => {
          if (userId === owner.id && !keyWords) {
            const newGroups = groups.filter((item) => item.groupId !== id);
            setGroups(newGroups);
          } else {
            setNumber((prev) => prev - 1);
            setRefId(null);
          }
        })
        .catch(({ response: { data: message } }) => setError(message));
    } else if (id) {
      axios
        .post("/group/join", { groupId: group.id })
        .then(({ data: { id: groupRefId } }) => {
          setRefId(groupRefId);
          setNumber((prev) => prev + 1);
        })
        .catch(({ response: { data: message } }) => setError(message));
    }
  }, [group]);

  if (!groups) return <Spinner />;
  return (
    <InfiniteScroll
      dataLength={groups.length}
      next={() => fetchData(groups.length)}
      hasMore={isMore}
      loader={<Spinner />}
    >
      <div className="list">
        {groups.map((item) => {
          const { groupId, subId, name, photo, numberOfMembers } = item;
          const data = {
            cardInfo: {
              id: groupId,
              refId: subId || null,
              refType: "group",
              photo,
              radiusPhoto: true,
              name,
              description,
              number: numberOfMembers,
            },
            texts: {
              subTitle: joinText,
              unsubTitle: leaveText,
            },
            collapse: {
              isCollapse: false,
            },
          };
          return <Card data={data} key={groupId} handleClick={setGroup} />;
        })}
      </div>
      {!groups.length && helpInformation && (
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

Groups.defaultProps = {
  keyWords: "",
  onlySubscribed: false,
  helpInformation: true,
};

Groups.propTypes = {
  userId: PropTypes.number.isRequired,
  keyWords: PropTypes.string,
  onlySubscribed: PropTypes.bool,
  helpInformation: PropTypes.bool,
};

export default Groups;
