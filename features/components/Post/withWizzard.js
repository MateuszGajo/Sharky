import React, { useState, useEffect, useContext } from "react";
import { uuid } from "uuidv4";
import axios from "axios";
import WizzardContext from "./context/WizzardContext";
import AppContext from "@features/context/AppContext";

const withWizzard = (WrappedComponent) => {
  return (props) => {
    const { newPost, idFanpage = "", idGroup = "", news = "" } = props;

    const { setError, owner } = useContext(AppContext);
    const [isMoreComment, setStatusOfMoreComments] = useState();
    const [isMorePosts, setStatusOfMorePosts] = useState(true);
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
    console.log(owner);
    const [users, setUsers] = useState({
      [owner.id]: {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName,
        photo: owner.photo,
      },
    });

    const [posts, setPosts] = useState([]);
    useEffect(() => {
      if (newPost?.content) {
        const { content, file } = newPost;
        const date = new Date();
        const data = new FormData();
        data.append("file", file);
        data.set("content", content);
        data.set("date", date.toUTCString());
        data.set("idGroup", idGroup);
        data.set("idFanpage", idFanpage);
        data.set("news", news);

        axios
          .post(`/post/add`, data)
          .then(({ data: { idPost, fileName } }) => {
            setPosts([
              {
                id: uuid(),
                idPost,
                idUser: owner.id,
                content,
                date,
                photo: fileName,
                numberOfShares: 0,
                numberOfComments: 0,
                numberOfLikes: 0,
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
