import React, { useState, useEffect, useContext } from "react";
import { uuid } from "uuidv4";
import axios from "axios";
import WizzardContext from "./context/WizzardContext";
import AppContext from "@features/context/AppContext";

const withWizzard = (WrappedComponent) => {
  return (props) => {
    const { newPost } = props;

    const { setStatusOfError: setError, owner } = useContext(AppContext);
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
    const [newContent, setNewContent] = useState({ text: "", idPost: null });
    const [muteUser, setMuteUser] = useState({ idUser: null });

    const [users, setUsers] = useState({});

    const [posts, setPosts] = useState([]);

    useEffect(() => {
      if (newPost?.content) {
        const { content, photo } = newPost;
        const date = new Date();
        axios
          .post("/post/add", {
            content,
            date,
            photo,
          })
          .then(({ data: { idPost } }) => {
            setPosts([
              {
                id: uuid(),
                idPost,
                idUser: owner.id,
                content,
                date,
                photo,
                numberOfShares: 0,
                numberOfComments: 0,
                numerOfLikes: 0,
                idShare: null,
                idUserShare: null,
                idLike: null,
              },
              ...posts,
            ]);
          })
          .catch(({ response: { data: message } }) => setError(message));
      }
    }, [newPost]);

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
          muteUser,
          setMuteUser,
          users,
          setUsers,
          posts,
          setPosts,
        }}
      >
        <WrappedComponent {...props} />
      </WizzardContext.Provider>
    );
  };
};

export default withWizzard;
