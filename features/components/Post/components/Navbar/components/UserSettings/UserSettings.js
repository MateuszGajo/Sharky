import React from "react";
import { BsEyeSlash } from "react-icons/bs";
import { FiVolumeX, FiFlag } from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { IconContext } from "react-icons";
import { muteUser, blockUser } from "../../../../services/Functions/index";
import i18next from "../../../../../../../i18n";
const { useTranslation } = i18next;

const UserSettings = ({
  idUser,
  setStatusOfHiddenPost,
  posts,
  setPosts,
  setStatusOfReport,
  setMuteUser,
}) => {
  const { t } = useTranslation(["component"]);
  const hiddenPostText = t("component:post.settings.hidden");
  const reportPostText = t("component:post.settings.report");
  const muteUserText = t("component:post.settings.mute");
  const blockUserText = t("component:post.settings.block");
  return (
    <>
      <div
        className="post__item__navbar__column-end__setting__collapse__item"
        onClick={() => setStatusOfHiddenPost(true)}
      >
        <div className="post__item__navbar__column-end__setting__collapse__item--icon">
          <IconContext.Provider
            value={{
              className:
                "post__item__navbar__column-end__setting__collapse__item--icon--customize",
            }}
          >
            <BsEyeSlash />
          </IconContext.Provider>
        </div>
        <div className="post__item__navbar__column-end__setting__collapse__item--name">
          <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
            {hiddenPostText}
          </span>
        </div>
      </div>
      <div
        className="post__item__navbar__column-end__setting__collapse__item"
        onClick={() =>
          muteUser({
            idMuteUser: idUser,
            setMuteUser,
          })
        }
      >
        <div className="post__item__navbar__column-end__setting__collapse__item--icon">
          <IconContext.Provider
            value={{
              className:
                "post__item__navbar__column-end__setting__collapse__item--icon--customize",
            }}
          >
            <FiVolumeX />
          </IconContext.Provider>
        </div>
        <div className="post__item__navbar__column-end__setting__collapse__item--name">
          <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
            {muteUserText}
          </span>
        </div>
      </div>
      <div
        className="post__item__navbar__column-end__setting__collapse__item"
        onClick={() => setStatusOfReport(true)}
      >
        <div className="post__item__navbar__column-end__setting__collapse__item--icon">
          <IconContext.Provider
            value={{
              className:
                "post__item__navbar__column-end__setting__collapse__item--icon--customize",
            }}
          >
            <FiFlag />
          </IconContext.Provider>
        </div>
        <div className="post__item__navbar__column-end__setting__collapse__item--name">
          <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
            {reportPostText}
          </span>
        </div>
      </div>
      <div
        className="post__item__navbar__column-end__setting__collapse__item"
        onClick={() => blockUser({ idBlockUser: idUser, posts, setPosts })}
      >
        <div className="post__item__navbar__column-end__setting__collapse__item--icon">
          <IconContext.Provider
            value={{
              className:
                "post__item__navbar__column-end__setting__collapse__item--icon--customize",
            }}
          >
            <MdBlock />
          </IconContext.Provider>
        </div>
        <div className="post__item__navbar__column-end__setting__collapse__item--name">
          <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
            {blockUserText}
          </span>
        </div>
      </div>
    </>
  );
};

export default UserSettings;
