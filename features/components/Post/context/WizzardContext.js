import React from "react";
import PropTypes from "prop-types";

const WizzardContext = React.createContext({
  isMoreComment: false,
  setStatusOfMoreComments: () => {},
  isMorePosts: false,
  setStatusOfMorePosts: () => {},
  newLike: {
    likeId: null,
    idElement: null,
    type: "",
    date: null,
  },
  setNewLike: () => {},
  newComment: {
    content: "",
    idElement: null,
    type: "",
    date: null,
  },
  setNewComment: () => {},
  newContent: { text: "", postId: null },
  setNewContent: () => {},
  muteUser: { userId: null },
  setMuteUser: () => {},
  users: [],
  setUsers: () => {},
  posts: [],
  setPosts: () => {},
});

WizzardContext.propTypes = {
  isMoreComment: PropTypes.bool,
  setStatusOfMoreComments: PropTypes.number,
  isMorePosts: PropTypes.bool,
  setStatusOfMorePosts: PropTypes.func,
  newLike: PropTypes.shape({
    likeId: PropTypes.number,
    idElement: PropTypes.number,
    type: PropTypes.string,
    date: PropTypes.string
  }),
  setNewLike: PropTypes.func,
  newComment: PropTypes.shape({
    content: PropTypes.string,
    idElement: PropTypes.number,
    type: PropTypes.string,
    date: PropTypes.string
  }),
  setNewComment: PropTypes.func,
  newContent: PropTypes.shape({ 
    text: PropTypes.string,
    postId: PropTypes.number
  }),
  setNewContent: PropTypes.func,
  muteUser: PropTypes.shape({ userId: PropTypes.number}),
  setMuteUser: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photo: PropTypes.string
  })),
  setUsers: PropTypes.func,
  posts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.number,
    likeId: PropTypes.number,
    postSharedUserId: PropTypes.number,
    shareId: PropTypes.number,
    content: PropTypes.string,
    date: PropTypes.string,
    numberOfLikes: PropTypes.number,
    numberOfShares: PropTypes.number,
    numberOfComments: PropTypes.number,
    isMoreComments: PropTypes.bool,
    comments:PropTypes.arrayOf(PropTypes.shape({
      commentId: PropTypes.number,
      postId: PropTypes.number,
      userId: PropTypes.number,
      likeId: PropTypes.number,
      numberOfLikes: PropTypes.number,
      numberOfReplies: PropTypes.number,
      content: PropTypes.string,
      date: PropTypes.string,
    }))
  })),
  setPosts: PropTypes.func
}

export default WizzardContext;
