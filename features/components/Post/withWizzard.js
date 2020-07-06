import React, { useState, useEffect } from "react";
import WizzardContext from "./context/WizzardContext";
import { getOwner } from "../../service/Functions/index";

const withWizzard = (WrappedComponent) => {
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

    useEffect(() => {
      getOwner(setOwner);
    }, []);
    const [posts, setPosts] = useState([]);

    return (
      <WizzardContext.Provider
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
      </WizzardContext.Provider>
    );
  };
};

export default withWizzard;
