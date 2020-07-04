import React, { useState } from "react";
import PostsContext from "./context/PostsContext";

const withPosts = (WrappedComponent) => {
  return () => {
    const [isMoreComment, setStatusOfMoreComments] = useState();
    const [isMorePosts, setStatusOfMorePosts] = useState();
    const [newLike, setNewLike] = useState({
      idLike: null,
      idElement: null,
      type: "",
      date: null,
    });
    const [newComment, setNewComment] = useState({
      content: "",
      idElement: null,
      type: "",
      date: null,
    });
    const [owner, setOwner] = useState({});
    const [newContent, setNewContent] = useState({ text: "", idPost: null });
    const [muteUser, setMuteUser] = useState({ idUser: null });
    const [users, setUsers] = useState({
      1: {
        id: 1,
        firstName: "Janek",
        lastName: "Kowalski",
        photo: "profile.png",
        idLiked: null,
      },
    });
    const [posts, setPosts] = useState([
      {
        id: "21sd",
        idPost: 1,
        idUser: 1,
        idLike: 1,
        idUserShare: 1,
        idShare: null,
        numberOfShares: 2,
        numberOfComments: 5,
        numberOfLikes: 6,
        isMoreComments: true,
        content: "dasdsa",
        date: new Date("2019-03-25"),
        photo: "profile.png",
        comments: [
          {
            id: 1,
            idUser: 1,
            likes: 20,
            content: "ble",
            numberOfReplies: 1,
            numberOfLikes: 5,
          },
          {
            id: 2,
            idUser: 1,
            likes: 20,
            content: "ble",
            numberOfReplies: 2,
            numberOfLikes: 2,
          },
        ],
      },
    ]);
    return (
      <PostsContext.Provider
        value={{
          isMoreComment,
          setStatusOfMoreComments,
          isMorePosts,
          setStatusOfMorePosts,
          newLike,
          setNewLike,
          newComment,
          setNewComment,
          newContent,
          setNewContent,
          owner,
          setOwner,
          muteUser,
          setMuteUser,
          users,
          setUsers,
          posts,
          setPosts,
        }}
      >
        <WrappedComponent />
      </PostsContext.Provider>
    );
  };
};

export default withPosts;
