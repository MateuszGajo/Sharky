import React, { useState } from "react";
import PostContext from "./context/PostContext";

const withPost = (WrappedComponent) => {
  return (props) => {
    const { user: u, userShare: us, single = false, post: p } = props;
    const [user, setUser] = useState(u);
    const [userShare, setUserShare] = useState(us);
    const [comments, setComments] = useState(p.comments);
    const [post, setPost] = useState(p);
    const [isMoreComments, setStatusOfMoreComments] = useState(
      p.isMoreComments
    );
    const [numberOfComments, setNumberOfComments] = useState(
      Number(p.numberOfComments)
    );
    const [isHidenPost, setStatusOfHiddenPost] = useState(false);
    const [isReport, setStatusOfReport] = useState(false);
    const [isEdit, setStatusOfEdit] = useState(false);
    const [isSingle, setStatusOfSingle] = useState(single);

    return (
      <PostContext.Provider
        value={{
          user,
          setUser,
          userShare,
          setUserShare,
          comments,
          setComments,
          post,
          setPost,
          isMoreComments,
          setStatusOfMoreComments,
          numberOfComments,
          setNumberOfComments,
          isHidenPost,
          setStatusOfHiddenPost,
          isReport,
          setStatusOfReport,
          isEdit,
          setStatusOfEdit,
          isSingle,
          setStatusOfSingle,
        }}
      >
        <WrappedComponent {...props} />
      </PostContext.Provider>
    );
  };
};

export default withPost;
