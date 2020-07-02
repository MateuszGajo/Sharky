import React from "react";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { IconContext } from "react-icons";
import i18next from "../../../../../../../i18n";
const { useTranslation } = i18next;

const OwnerSettings = ({ setStatusOfEdit }) => {
  const { t } = useTranslation(["component"]);
  const editPostText = t("component:post.settings.edit");
  const deletePostText = t("component:post.settings.delete");
  return (
    <>
      <div
        className="post__item__navbar__column-end__setting__collapse__item"
        onClick={() => setStatusOfEdit(true)}
      >
        <div className="post__item__navbar__column-end__setting__collapse__item--icon">
          <IconContext.Provider
            value={{
              className:
                "post__item__navbar__column-end__setting__collapse__item--icon--customize",
            }}
          >
            <FiEdit />
          </IconContext.Provider>
        </div>
        <div className="post__item__navbar__column-end__setting__collapse__item--name">
          <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
            {editPostText}
          </span>
        </div>
      </div>
      <div className="post__item__navbar__column-end__setting__collapse__item">
        <div className="post__item__navbar__column-end__setting__collapse__item--icon">
          <IconContext.Provider
            value={{
              className:
                "post__item__navbar__column-end__setting__collapse__item--icon--customize",
            }}
          >
            <AiOutlineDelete />
          </IconContext.Provider>
        </div>
        <div className="post__item__navbar__column-end__setting__collapse__item--name">
          <span className="post__item__navbar__column-end__setting__collapse__item--name--span">
            {deletePostText}
          </span>
        </div>
      </div>
    </>
  );
};

export default OwnerSettings;
