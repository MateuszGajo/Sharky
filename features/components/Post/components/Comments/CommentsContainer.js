import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import SecondaryInput from "../../../../common/SecondaryInput/SecondaryInput";
import i18next from "../../../../../i18n";
import { getReplies, addReply } from "../../services/Functions/index";
import { setupCache } from "axios-cache-adapter";
const { useTranslation } = i18next;

const withContainer = (WrappedComponent) => {
  const WithContainer = ({
    comment = {
      id: 1,
      idUser: 1,
      idLike: null,
      numberOfLikes: 20,
      numberOfReplies: 10,
      content: "ble",
      date: new Date(),
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
    newLike,
    setNewLike,
    newComment,
    setNewComment,
    owner,
  }) => {
    const { t } = useTranslation(["component"]);

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
        idComment: comment.id,
        content: reply,
        date: new Date(),
        clearText: setReply,
        setNewComment,
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

    useEffect(() => {
      if (newComment.type == "comment" && newComment.idElement == comment.id) {
        setReplies([
          {
            id: newComment.idElement,
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
    return (
      <>
        <WrappedComponent
          comment={comment}
          numberOfReplies={numberOfReplies}
          user={user}
          setStatusOfOpenReplies={setStatusOfOpenReplies}
          isRepliesOpen={isRepliesOpen}
          focusCollapse={focusCollapse}
          focusIcon={focusIcon}
          getReplies={gReplies}
          newLike={newLike}
          setNewLike={setNewLike}
          newComment={newComment}
          setNewComment={setNewComment}
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
                  key={comment.id}
                  comment={comment}
                  user={user}
                  focusCollapse={focusCollapse}
                  focusIcon={focusIcon}
                  newLike={newLike}
                  setNewLike={setNewLike}
                  newComment={newComment}
                  setNewComment={setNewComment}
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
