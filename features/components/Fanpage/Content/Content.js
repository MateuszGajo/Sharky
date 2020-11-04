import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import i18next from "@i18n";
import Home from "./components/Home/Home";
import Members from "./components/Members/Members";
import About from "./components/About/About";

const { useTranslation } = i18next;

const Content = ({ section, fanpageId, role }) => {
  const { t } = useTranslation(["fanpage"]);

  const homeName = t("fanpage:home");
  const membersName = t("fanpage:members");
  const aboutName = t("fanpage:about");

  const renderComponent = (name) => {
    switch (name) {
      case homeName:
        return <Home fanpageId={fanpageId} role={role} />;
      case membersName:
        return <Members fanpageId={fanpageId} role={role} />;
      case aboutName:
        return <About fanpageId={fanpageId} />;
      default:
        return <Home fanpageId={fanpageId} role={role} />;
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

Content.propTypes = {
  section: PropTypes.string,
  fanpageId: PropTypes.number.isRequired,
  role: PropTypes.string,
};

export default Content;
