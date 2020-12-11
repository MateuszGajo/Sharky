import React, { useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { BsThreeDots } from "react-icons/bs";
import OwnerMenu from "./components/OwnerMenu/OwnerMenu";
import UserMenu from "./components/UserMenu/UserMenu";
import i18next from "~i18n";
import AppContext from "~features/context/AppContext";

const { useTranslation } = i18next;

const Menu = ({
  focusCollapse,
  focusIcon,
  id,
  comment,
  replies,
  setReplies,
  setNumberOfReplies,
}) => {
  const { t } = useTranslation(["component"]);

  const settingRef = useRef(null);
  const reportCommentText = t("component:post.comments.settings.report");
  const deleteCommentText = t("component:post.comments.settings.delete");

  const { owner } = useContext(AppContext);
  const handleClick = () => {
    const { current: fCollapse } = focusCollapse;
    const { current: fIcon } = focusIcon;
    if (!fCollapse.classList.contains("is-close")) {
      fCollapse.classList.add("is-close");
    }

    if (fIcon.classList.contains("is-visible")) {
      fIcon.classList.remove("is-visible");
    }

    window.removeEventListener("click", handleClick);
  };

  const openSetting = () => {
    const { current } = settingRef;
    const collapseItem = current.querySelector(
      ".post__item__comments__container__item__content__item__top-bar__icon__collapse "
    );
    const { current: fCollapse } = focusCollapse;
    const { current: fItem } = focusIcon;
    if (fCollapse !== collapseItem && fCollapse !== null) {
      fCollapse.classList.add("is-close");
    }

    if (fItem !== null && !fItem.classList.contains("is-visible")) {
      fItem.classList.remove("is-visible");
    }

    window.addEventListener("click", handleClick);

    current.classList.toggle("is-visible");
    focusIcon.current = current;

    collapseItem.classList.toggle("is-close");
    focusCollapse.current = collapseItem;
  };

  useEffect(() => {
    settingRef.current.addEventListener("click", openSetting);

    return () => {
      settingRef.current.removeEventListener("click", openSetting);
      settingRef.current.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <div
      className="post__item__comments__container__item__content__item__top-bar__icon"
      ref={settingRef}
      onClick={(e) => e.stopPropagation()}
      aria-hidden="true"
    >
      <BsThreeDots />
      <div className="post__item__comments__container__item__content__item__top-bar__icon__collapse is-close">
        {owner.id === id ? (
          <OwnerMenu
            deleteCommentText={deleteCommentText}
            comment={comment}
            replies={replies}
            setReplies={setReplies}
            setNumberOfReplies={setNumberOfReplies}
          />
        ) : (
          <UserMenu
            reportCommentText={reportCommentText}
            id={id}
            comment={comment}
          />
        )}
      </div>
    </div>
  );
};

Menu.defaultProps = {
  focusIcon: {
    current: null,
  },
  focusCollapse: {
    current: null,
  },
  replies: [
    {
      replyId: null,
      userId: null,
      numberOFLikes: null,
      likedId: null,
      date: "",
      content: "",
    },
  ],
};

const element = typeof Element === "undefined" ? () => {} : Element;
Menu.propTypes = {
  focusCollapse: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(element) }),
  ]),
  focusIcon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(element) }),
  ]),
  id: PropTypes.number.isRequired,
  comment: PropTypes.shape({
    replyId: PropTypes.number,
    commentId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    likeId: PropTypes.number,
    numberOfLikes: PropTypes.number.isRequired,
    numberOfReplies: PropTypes.number.isRequired,
    postId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
  }).isRequired,
  replies: PropTypes.shape({
    replyId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    numberOFLikes: PropTypes.number.isRequired,
    likedId: PropTypes.number,
    date: PropTypes.string.isRequired,
    content: PropTypes.string,
  }),
  setReplies: PropTypes.func.isRequired,
  setNumberOfReplies: PropTypes.func.isRequired,
};

export default Menu;
