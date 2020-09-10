import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "@components/Layout/Home/Compound/components/NavBar/Navbar";
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
  const idGroup = router.query.id;

  const { t } = useTranslation(["group"]);

  const { isError, setOwner } = useContext(AppContext);

  const groupDoesNotExist = t("group:error.does-not-exist");

  const [section, setSection] = useState("home");
  const [isPopupOpen, setStatusOfPopUp] = useState(false);
  const [idMember, setIdMember] = useState(null);
  const [role, setRole] = useState("");
  const [groupName, setGroupName] = useState("");
  const [numberOfMembers, setNumberOfMembers] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [isLoading, setStatusOfLoading] = useState(true);
  const [isGroupExist, setStatusOfExistsGroup] = useState(true);
  const [isAuth, setStatusOfAuth] = useState(null);

  const getGroupInfo = () => {
    axios
      .post("/group/about", { idGroup })
      .then(({ data: { date, numberOfMembers } }) => {
        console.log(numberOfMembers);
        setNumberOfMembers(numberOfMembers);
        setCreationDate(date);
      });
  };

  useEffect(() => {
    idGroup &&
      isAuth &&
      axios
        .post("/group/enter", { idGroup })
        .then(({ data: { id, idMember, name, role } }) => {
          if (!id) {
            setStatusOfExistsGroup(false);
            return setStatusOfLoading(false);
          }
          getGroupInfo();
          setIdMember(idMember);
          idMember && setRole(role);
          setGroupName(name);
          setStatusOfLoading(false);
        });
  }, [idGroup, isAuth]);

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
              idTarget={idGroup}
              type="group"
            />
          )}

          <div className="group__container">
            <Content
              section={section}
              idGroup={idGroup}
              role={role}
              idMember={idMember}
              setNumberOfMembers={setNumberOfMembers}
              numberOfMembers={numberOfMembers}
              groupName={groupName}
              creationDate={creationDate}
            />
            <SideBar
              setSection={setSection}
              setStatusOfPopUp={setStatusOfPopUp}
              groupName={groupName}
              idMember={idMember}
              idGroup={idGroup}
              setIdMember={setIdMember}
              setRole={setRole}
              section={section}
              role={role}
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
