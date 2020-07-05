import React, { useContext } from "react";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { IconContext } from "react-icons";
import i18next from "../../../../../../../i18n";
import {
  deletePost,
  deletePostShare,
} from "../../../../services/Functions/index";
import PostContext from "../../../../context/PostContext";
import WizzardContext from "../../../../context/WizzardContext";
const { useTranslation } = i18next;

const OwnerSettings = () => {
  const { t } = useTranslation(["component"]);

  const { setStatusOfEdit, post } = useContext(PostContext);
  const { posts, setPosts } = useContext(WizzardContext);

  const isShare = post.idUserShare !== null;
  const selfShare = post.idUserShare == post.idUser;
  const { idShare, idPost } = post;

  const editPostText = t("component:post.settings.edit");
  const deletePostText = t("component:post.settings.delete");
  const deletePostShareText = t("component:post.settings.delete-share");
  return (
    <>
      {!selfShare && (
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
      )}

      <div
        className="post__item__navbar__column-end__setting__collapse__item"
        onClick={() => {
          if (isShare) {
            deletePostShare({ idShare, posts, setPosts });
          } else {
            deletePost({ idPost, posts, setPosts });
          }
        }}
      >
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
            {isShare ? deletePostShareText : deletePostText}
          </span>
        </div>
      </div>
    </>
  );
};

export default OwnerSettings;
