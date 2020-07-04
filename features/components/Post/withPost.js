import React, { useState } from "react";
import PostContext from "./context/PostContext";

const withPost = (WrappedComponent) => {
  return ({ user: u, userShare: us, single, post: p }) => {
    const [user, setUser] = useState(u);
    const [userShare, setUserShare] = useState(us);
    const [comments, setComments] = useState();
    const [post, setPost] = useState(p);
    const [isMoreComments, setStatusOfMoreComments] = useState();
    const [numberOfComments, setNumberOfComments] = useState();
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
          setPosts,
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
        <WrappedComponent />
      </PostContext.Provider>
    );
  };
};

export default withPost;
