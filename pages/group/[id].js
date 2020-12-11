import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "~features/service/Axios";
import Navbar from "~components/Layout/Home/Compound/components/NavBar/NavBar";
import SideBar from "~components/group/SideBar/SideBar";
import Content from "~components/group/Content/Content";
import InvitePerson from "~common/PopUp/InvitePerson/InvitePerson";
import Spinner from "~components/Spinner/Spinner";
import i18next from "~i18n";
import AppContext from "~features/context/AppContext";
import { getOwner } from "~features/service/Functions/index";
import PopUpHandlers from "~components/PopUpHandlers/PopUpHandlers";
import "../../styles/group.scss";

const { useTranslation } = i18next;

const Group = () => {
  const router = useRouter();
  const groupId = Number(router.query.id);

  const { t } = useTranslation(["group"]);

  const { setOwner } = useContext(AppContext);

  const groupDoesNotExist = t("group:error.does-not-exist");

  const [section, setSection] = useState("home");
  const [isPopupOpen, setStatusOfPopUp] = useState(false);
  const [memberId, setIdMember] = useState(null);
  const [role, setRole] = useState("");
  const [groupName, setGroupName] = useState("");
  const [photo, setPhoto] = useState("");
  const [numberOfMembers, setNumberOfMembers] = useState(null);
  const [startingDate, setStartingDate] = useState(null);
  const [isLoading, setStatusOfLoading] = useState(true);
  const [isGroupExist, setStatusOfExistsGroup] = useState(true);
  const [isAuth, setStatusOfAuth] = useState(null);

  const getGroupInfo = () => {
    axios
      .post("/group/about", { groupId })
      .then(({ data: { date, initialNumberOfMembers } }) => {
        setNumberOfMembers(initialNumberOfMembers);
        setStartingDate(date);
      });
  };

  useEffect(() => {
    if (groupId && isAuth) {
      axios
        .post("/group/enter", { groupId })
        .then(
          ({
            data: { id, initialMemberId, name, initialRole, initialPhoto },
          }) => {
            if (!id) {
              setStatusOfExistsGroup(false);
              setStatusOfLoading(false);
              return;
            }
            getGroupInfo();
            setPhoto(initialPhoto);
            setIdMember(initialMemberId);
            initialMemberId && setRole(initialRole);
            setGroupName(name);
            setStatusOfLoading(false);
          }
        );
    }
  }, [groupId, isAuth]);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth === null) return <Spinner />;
  if (!isAuth) {
    router.push("/signin");
    return <Spinner />;
  }
  if (isLoading) return <Spinner />;

  return (
    <section className="group">
      <PopUpHandlers />
      <Navbar />
      {isGroupExist ? (
        <>
          {isPopupOpen && (
            <InvitePerson
              isOpen={isPopupOpen}
              setStatusOfOpen={setStatusOfPopUp}
              targetId={groupId}
              type="group"
            />
          )}

          <div className="group__container">
            <Content
              section={section}
              groupId={groupId}
              role={role}
              memberId={memberId}
              setNumberOfMembers={setNumberOfMembers}
              numberOfMembers={numberOfMembers}
              groupName={groupName}
              startingDate={startingDate}
            />
            <SideBar
              setSection={setSection}
              setStatusOfPopUp={setStatusOfPopUp}
              groupName={groupName}
              memberId={memberId}
              groupId={groupId}
              setIdMember={setIdMember}
              setRole={setRole}
              section={section}
              role={role}
              photo={photo}
              setPhoto={setPhoto}
            />
          </div>
        </>
      ) : (
        <div className="group__does-not-exist">{groupDoesNotExist}</div>
      )}
    </section>
  );
};

export default Group;
