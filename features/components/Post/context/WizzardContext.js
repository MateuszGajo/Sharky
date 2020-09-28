import React from "react";

export default React.createContext({
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
