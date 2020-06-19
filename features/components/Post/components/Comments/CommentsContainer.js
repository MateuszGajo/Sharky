import React, { useState, useRef } from "react";
import Comment from "./Comment";
import SecondaryInput from "../../../../common/SecondaryInput/SecondaryInput";

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
    const collapseSetting = useRef(null);
    const [isRepliesOpen, setStatusOfOpenReplies] = useState(false);
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
              <SecondaryInput size={"medium"} />
            </div>
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
