import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "@components/Layout/Home/Compound/components/NavBar/NavBar";
import SideBar from "@components/group/SideBar/SideBar";
import Content from "@components/group/Content/Content";
import InvitePerson from "@common/PopUp/InvitePerson/InvitePerson";
import Spinner from "@components/Spinner/Spinner";
import i18next from "@i18n";
import PopUpError from "@common/PopUp/Error/Error";
import AppContext from "@features/context/AppContext";
import { getOwner } from "@features/service/Functions/index";

import "../../styles/group.scss";
const { useTranslation } = i18next;

const Group = () => {
  const router = useRouter();
  const groupId = Number(router.query.id);

  const { t } = useTranslation(["group"]);

  const { isError, setOwner } = useContext(AppContext);

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
      .then(({ data: { date, numberOfMembers } }) => {
        setNumberOfMembers(numberOfMembers);
        setStartingDate(date);
      });
  };

  useEffect(() => {
    groupId &&
      isAuth &&
      axios
        .post("/group/enter", { groupId })
        .then(({ data: { id, memberId, name, role, photo } }) => {
          if (!id) {
            setStatusOfExistsGroup(false);
            return setStatusOfLoading(false);
          }
          getGroupInfo();
          setPhoto(photo);
          setIdMember(memberId);
          memberId && setRole(role);
          setGroupName(name);
          setStatusOfLoading(false);
        });
  }, [groupId, isAuth]);

  useEffect(() => {
    getOwner({ setStatusOfAuth, setOwner });
  }, []);

  if (isAuth == null) return <Spinner />;
  else if (!isAuth) {
    router.push("/signin");
    return <Spinner />;
  } else if (isLoading) return <Spinner />;

  return (
    <section className="group">
      {isError && <PopUpError message={isError} />}
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
