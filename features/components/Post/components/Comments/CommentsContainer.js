import React, { useState, useRef } from "react";
import axios from "axios";
import Comment from "./Comment";
import SecondaryInput from "../../../../common/SecondaryInput/SecondaryInput";
import i18next from "../../../../../i18n";
const { useTranslation } = i18next;

const withContainer = (WrappedComponent) => {
  const WithContainer = ({
    comment = {
      id: 1,
      likes: 20,
      content: "ble",
      numberOfReplies: 1,
    },
    user = {
      id: 1,
      firstName: "Janek",
      lastName: "Kowalski",
      photo: "profile.png",
    },
    focusCollapse,
    focusIcon,
  }) => {
    const { t } = useTranslation(["component"]);

    const loadMoreComments = t("component:post.comments.load-more-comments");

    const [isRepliesOpen, setStatusOfOpenReplies] = useState(false);
    const [reply, setReply] = useState("");
    const [replies, setReplies] = useState([]);
    const [isMoreReplies, setStatusOfMoreReplies] = useState(
      comment.numberOfReplies > 0
    );
    const handleSubmit = (e) => {
      e.preventDefault();
      axios
        .post("/reply/add", {
          idComment: comment.id,
          content: reply,
        })
        .then(({ data: { id, idUser } }) => {
          setReply("");
          setReplies([{ id, idUser, likes: 0, content: reply }, ...replies]);
        })
        .catch((err) => console.log(err));
    };

    const getReplies = () => {
      axios
        .post("/reply/get", {
          idComment: comment.id,
          from: replies.length,
        })
        .then(({ data: { replies: r, isMore } }) => {
          setReplies([...replies, ...r]);
          setStatusOfMoreReplies(isMore);
        })
        .catch((err) => console.log(err));
    };

    return (
      <>
        <WrappedComponent
          comment={comment}
          user={user}
          setStatusOfOpenReplies={setStatusOfOpenReplies}
          isRepliesOpen={isRepliesOpen}
          focusCollapse={focusCollapse}
          focusIcon={focusIcon}
          getReplies={getReplies}
        />

        {isRepliesOpen && (
          <div className="post__item__comments__container--margin">
            <div className="post__item__comments__container__wrapper__input">
              <form onSubmit={handleSubmit}>
                <SecondaryInput
                  size={"medium"}
                  value={reply}
                  onChange={setReply}
                />
              </form>
            </div>
            {replies.map((comment) => {
              return (
                <WrappedComponent
                  comment={comment}
                  user={user}
                  focusCollapse={focusCollapse}
                  focusIcon={focusIcon}
                />
              );
            })}
            {isMoreReplies && (
              <p
                className="post__item__comments__container__more-content"
                onClick={() => getReplies()}
              >
                {loadMoreComments}
              </p>
            )}
          </div>
        )}
      </>
    );
  };
  return WithContainer;
};

export default withContainer(Comment);
