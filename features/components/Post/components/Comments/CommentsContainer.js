import React, { useState, useEffect, useContext } from "react";
import Comment from "./Comment";
import SecondaryInput from "@common/SecondaryInput/SecondaryInput";
import i18next from "@i18n";
import { getReplies, addReply } from "../../services/Functions";
import WizzardContext from "../../context/WizzardContext";
import AppContext from "@features/context/AppContext";
const { useTranslation } = i18next;

const withContainer = (WrappedComponent) => {
  const WithContainer = ({ comment, focusCollapse, focusIcon }) => {
    const { t } = useTranslation(["component"]);

    const { setError, owner } = useContext(AppContext);
    const { users, setUsers, muteUser, newComment, setNewComment } = useContext(
      WizzardContext
    );

    const loadMoreComments = t("component:post.comments.load-more-comments");
    const [user, setUser] = useState(users[comment.idUser]);
    const [isRepliesOpen, setStatusOfOpenReplies] = useState(false);
    const [reply, setReply] = useState("");
    const [replies, setReplies] = useState([]);
    const [isMoreReplies, setStatusOfMoreReplies] = useState(
      comment.numberOfReplies > 0
    );
    const [numberOfReplies, setNumberOfReplies] = useState(
      Number(comment.numberOfReplies)
    );

    const handleSubmit = (e) => {
      e.preventDefault();

      addReply({
        idComment: comment.idComment,
        content: reply,
        date: new Date(),
        clearText: setReply,
        setNewComment,
        setError,
      });
    };

    const gReplies = () => {
      getReplies({
        idComment: comment.idComment,
        from: replies.length,
        replies,
        setReplies,
        users,
        setUsers,
        setStatusOfMoreData: setStatusOfMoreReplies,
      });
    };

    useEffect(() => {
      if (
        newComment.type == "comment" &&
        newComment.idElement == comment.idComment
      ) {
        if (!isRepliesOpen) setStatusOfOpenReplies(true);
        setReplies([
          {
            idReply: newComment.idReply,
            idComment: newComment.idComment,
            idUser: owner.id,
            content: newComment.content,
            date: newComment.date,
            numberOfLikes: 0,
          },
          ...replies,
        ]);
        setNumberOfReplies(numberOfReplies + 1);
      }
    }, [newComment]);

    useEffect(() => {
      if (muteUser.idUser != null) {
        const newReplies = replies?.filter(
          (reply) => reply.idUser != muteUser.idUser
        );
        setReplies(newReplies);
      }
    }, [muteUser]);

    return (
      <>
        <WrappedComponent
          comment={comment}
          numberOfReplies={numberOfReplies}
          setStatusOfOpenReplies={setStatusOfOpenReplies}
          isRepliesOpen={isRepliesOpen}
          focusCollapse={focusCollapse}
          focusIcon={focusIcon}
          getReplies={gReplies}
          user={user}
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
                  key={comment.idReply}
                  comment={comment}
                  focusCollapse={focusCollapse}
                  focusIcon={focusIcon}
                  user={user}
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
