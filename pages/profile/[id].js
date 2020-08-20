import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import NavBar from "@components/Layout/Home/Compound/components/NavBar/Navbar";
import AboutMe from "@components/Profile/AboutMe/AboutMe";
import DisplayItem from "@components/Profile/DisplayItem/DisplayItem";
import Spinner from "@components/Spinner/Spinner";
import Error from "@common/PopUp/Error/Error";
import AppContext from "@features/context/AppContext";
import "../../styles/main.scss";

const profile = () => {
  const router = useRouter();
  const idUser = router.query.id;

  const { isError } = useContext(AppContext);

  const [chooseItem, setChooseItem] = useState("");
  const [isLoading, setStatusOfLoading] = useState(true);
  const [info, setInfo] = useState({});

  useEffect(() => {
    idUser &&
      axios.post("/user/info", { idUser }).then(({ data: { info } }) => {
        setInfo(info);
        setStatusOfLoading(false);
      });
  }, [idUser]);

  if (isLoading) return <Spinner />;
  return (
    <section className="profile">
      {isError && <Error message={isError} />}
      <NavBar />
      {chooseItem !== "" ? (
        <DisplayItem
          setChooseItem={setChooseItem}
          chooseItem={chooseItem}
          info={info}
          idUser={idUser}
        />
      ) : (
        <AboutMe setChooseItem={setChooseItem} info={info} idUser={idUser} />
      )}
    </section>
  );
};

export default profile;
