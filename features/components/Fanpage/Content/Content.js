import React from "react";
import cx from "classnames";
import i18next from "@i18n";
import Home from "./components/Home/Home";
import Members from "./components/Members/Members";
import About from "./components/About/About";

const { useTranslation } = i18next;

const Content = ({ section, idFanpage, role }) => {
  const { t } = useTranslation(["fanpage"]);

  const homeName = t("fanpage:home");
  const membersName = t("fanpage:members");
  const aboutName = t("fanpage:about");

  const renderComponent = (name) => {
    switch (name) {
      case homeName:
        return <Home idFanpage={idFanpage} />;
      case membersName:
        return <Members idFanpage={idFanpage} role={role} />;
      case aboutName:
        return <About idFanpage={idFanpage} />;
      default:
        return <Home idFanpage={idFanpage} />;
    }
  };
  return (
    <div
      className={cx("fanpage__content", {
        "fanpage__content--margin": section !== aboutName,
        "fanpage__content--grow": section === aboutName,
      })}
    >
      {renderComponent(section)}
    </div>
  );
};

export default Content;
