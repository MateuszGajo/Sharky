import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { uuid } from "uuidv4";
import axios from "axios";
import WizzardContext from "./context/WizzardContext";
import AppContext from "@features/context/AppContext";

const withWizzard = (Component) => {
  const Wrapped =(props) => {
    const { newPost, fanpageId = "", groupId = "", news = "" } = props;

    const { setError, owner } = useContext(AppContext);
    const [isMoreComment, setStatusOfMoreComments] = useState(false);
    const [isMorePosts, setStatusOfMorePosts] = useState(false);
    const [newLike, setNewLike] = useState({
      likeId: null,
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
    const [newContent, setNewContent] = useState({ text: "", postId: null });
    const [muteUser, setMuteUser] = useState({ userId: null });

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
        const { content, file, setContent, setFile } = newPost;
        const date = new Date();
        const data = new FormData();
        data.append("file", file);
        data.set("content", content);
        data.set("date", date.toUTCString());
        data.set("groupId", groupId);
        data.set("fanpageId", fanpageId);
        data.set("news", news);

        axios
          .post(`/post/add`, data)
          .then(({ data: { postId, fileName } }) => {
            setPosts([
              {
                id: uuid(),
                postId,
                userId: owner.id,
                content,
                date,
                photo: fileName,
                numberOfShares: 0,
                numberOfComments: 0,
                numberOfLikes: 0,
                shareId: null,
                postSharedUserId: null,
                likeId: null,
              },
              ...posts,
            ]);
            setContent("");
            setFile("");
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
        <Component {...props} />
      </WizzardContext.Provider>
    );
  };

  Wrapped.propTypes = {
    newPost: PropTypes.shape({
      content: PropTypes.string, 
      setContent: PropTypes.func,
      file:PropTypes.object, 
      setFile: PropTypes.func
    }), 
    fanpageId: PropTypes.number, 
    groupId: PropTypes.number, 
    news: PropTypes.bool
  }
  return Wrapped
};

export default withWizzard;
