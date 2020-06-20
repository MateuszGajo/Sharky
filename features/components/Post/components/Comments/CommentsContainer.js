import React, { useState, useRef } from "react";
import Comment from "./Comment";
import SecondaryInput from "../../../../common/SecondaryInput/SecondaryInput";
import axios from "axios";

const withContainer = (WrappedComponent) => {
  const WithContainer = ({
    comment = {
      id: 1,
      likes: 20,
      content: "ble",
      replies: [
        { id: 1, likes: 20, content: "sdasa" },
        { id: 2, likes: 30, content: "dasdss" },
      ],
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
    const [isRepliesOpen, setStatusOfOpenReplies] = useState(false);
    const [reply, setReply] = useState("");
    const [addedReplies, setAddedReplies] = useState([]);

    const handleSubmit = (e) => {
      e.preventDefault();
      axios
        .post("/reply/add", {
          idComment: comment.id,
          content: reply,
        })
        .then(({ data: { id, idUser } }) => {
          console.log(resp);
          setReply("");
          setAddedReplies([
            ...addedReplies,
            { id, idUser, likes: 0, content: reply },
          ]);
        })
        .catch((err) => console.log(err));
    };

    const addReplies = () => {
      const elements = [];
      for (let i = addedReplies.length - 1; i >= 0; i--) {
        elements.push(
          <WrappedComponent
            key={i}
            comment={addedReplies[i]}
            user={user}
            focusCollapse={focusCollapse}
            focusIcon={focusIcon}
          />
        );
      }
      return elements;
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
            {addReplies()}
            {comment.replies.map((comment) => {
              return (
                <WrappedComponent
                  comment={comment}
                  user={user}
                  focusCollapse={focusCollapse}
                  focusIcon={focusIcon}
                />
              );
            })}
          </div>
        )}
      </>
    );
  };
  return WithContainer;
};

export default withContainer(Comment);
