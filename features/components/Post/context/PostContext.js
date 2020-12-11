import React from "react";
import PropTypes from "prop-types";

const PostContext = React.createContext({
  user: { id: null, firstName: "", lastName: "", photo: "" },
  setUser: () => {},
  secondaryUser: { id: null, firstName: "", lastName: "", photo: "" },
  setUserShare: () => {},
  comments: [
    {
      commentId: null,
      postId: null,
      userId: null,
      likeId: null,
      numberOfLikes: null,
      numberOfReplies: null,
      content: "",
      date: "",
    },
  ],
  setComments: () => {},
  post: {
    id: null,
    userId: null,
    likeId: null,
    postSharedUserId: null,
    shareId: null,
    content: "",
    date: "",
    numberOfLikes: null,
    numberOfShares: null,
    numberOfComments: null,
    isMoreComments: false,
    comments: [
      {
        commentId: null,
        postId: null,
        userId: null,
        likeId: null,
        numberOfLikes: null,
        numberOfReplies: null,
        content: "",
        date: "",
      },
    ],
  },
  setPost: () => {},
  isMoreComments: false,
  setStatusOfMoreComments: () => {},
  numberOfComments: null,
  setNumberOfComments: () => {},
  isHidenPost: false,
  setStatusOfHiddenPost: () => {},
  isReport: false,
  setStatusOfReport: () => {},
  isEdit: false,
  setStatusOfEdit: () => {},
  isSingle: false,
  setStatusOfSingle: () => {},
});

PostContext.Provider.propTypes = {
  value: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      photo: PropTypes.string,
    }),
    setUser: PropTypes.func,
    secondaryUser: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      photo: PropTypes.string,
    }),
    setUserShare: PropTypes.func,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        commentId: PropTypes.number,
        postId: PropTypes.number,
        userId: PropTypes.number,
        likeId: PropTypes.number,
        numberOfLikes: PropTypes.number,
        numberOfReplies: PropTypes.number,
        content: PropTypes.string,
        date: PropTypes.string,
      })
    ),
    setComments: PropTypes.func,
    setPost: PropTypes.func,
    isMoreComments: PropTypes.bool,
    setStatusOfMoreComments: PropTypes.func,
    numberOfComments: PropTypes.number,
    setNumberOfComments: PropTypes.func,
    isHidenPost: PropTypes.bool,
    setStatusOfHiddenPost: PropTypes.func,
    isReport: PropTypes.bool,
    setStatusOfReport: PropTypes.func,
    isEdit: PropTypes.bool,
    setStatusOfEdit: PropTypes.func,
    isSingle: PropTypes.bool,
    setStatusOfSingle: PropTypes.func,
  }),
};

export default PostContext;
