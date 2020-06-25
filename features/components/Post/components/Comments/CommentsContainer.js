import React, { useState } from "react";
import Comment from "./Comment";
import SecondaryInput from "../../../../common/SecondaryInput/SecondaryInput";
import i18next from "../../../../../i18n";
import { getReplies, addReply } from "../../services/Functions/index";
const { useTranslation } = i18next;

const withContainer = (WrappedComponent) => {
  const WithContainer = ({
    comment = {
      id: 1,
      idUser: 1,
      likes: 20,
      content: "ble",
      numberOfReplies: 1,
    },
    users = {
      1: {
        id: 1,
        firstName: "Janek",
        lastName: "Kowalski",
        photo: "profile.png",
      },
    },
    setUsers,
    focusCollapse,
    focusIcon,
  }) => {
    const { t } = useTranslation(["component"]);

    const loadMoreComments = t("component:post.comments.load-more-comments");

    const [user, setUser] = useState(users[comment.idUser]);
    console.log(user);
    const [isRepliesOpen, setStatusOfOpenReplies] = useState(false);
    const [reply, setReply] = useState("");
    const [replies, setReplies] = useState([]);
    const [isMoreReplies, setStatusOfMoreReplies] = useState(
      comment.numberOfReplies > 0
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      addReply({
        idComment: comment.id,
        content: reply,
        replies,
        setReplies,
        date: new Date(),
        clearText: setReply,
      });
    };

    const gReplies = () =>
      getReplies({
        idComment: comment.id,
        from: replies.length,
        replies,
        setReplies,
        users,
        setUsers,
        setStatusOfMoreData: setStatusOfMoreReplies,
      });

    return (
      <>
        <WrappedComponent
          comment={comment}
          user={user}
          setStatusOfOpenReplies={setStatusOfOpenReplies}
          isRepliesOpen={isRepliesOpen}
          focusCollapse={focusCollapse}
          focusIcon={focusIcon}
          getReplies={gReplies}
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
                onClick={() => gReplies()}
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
