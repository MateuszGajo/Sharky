import React, { useState } from "react";
import PropTypes from "prop-types";
import PostContext from "./context/PostContext";

const withPost = (Component) => {
  const Wrapped = (props) => {
    const { user: u, secondaryUser: us, single = false, post: p } = props;
    const [user, setUser] = useState(u);
    const [secondaryUser, setUserShare] = useState(us);
    const [comments, setComments] = useState(p.comments || []);
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
          secondaryUser,
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
        <Component {...props} />
      </PostContext.Provider>
    );
  };
  Wrapped.propTypes ={
    user: PropTypes.shape({
      id:PropTypes.id,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      photo: PropTypes.string
      }),
    secondaryUser: PropTypes.shape({
      id: PropTypes.id,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      photo: PropTypes.stirng
      }),
      single: PropTypes.bool,
      post: PropTypes.shape({
        id: PropTypes.string,
        postId: PropTypes.number,
        userId: PropTypes.number,
        likeId: PropTypes.number,
        postSharedUserId: PropTypes.number,
        shareId: PropTypes.number,
        numberOfComments: PropTypes.number,
        numberOfLikes: PropTypes.number,
        numberOfShares: PropTypes.number,
        content: PropTypes.string,
        date: PropTypes.string,
        isMoreComments: PropTypes.bool,
        comments: PropTypes.arrayOf(PropTypes.shape({
          commentId: PropTypes.number,
          postId: PropTypes.number,
          userId: PropTypes.number,
          likeId: PropTypes.number,
          numberOfLikes: PropTypes.number,
          numberOfReplies: PropTypes.number,
          content: PropTypes.string,
          date: PropTypes.string
        }))
      })
  }
  return Wrapped
};

export default withPost;
