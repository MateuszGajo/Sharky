import axios from "axios";
import { uuid } from "uuidv4";
import Router from "next/router";

export const getUsers = async (users, setUsers, elements) => {
  const idUsers = [];

  for (let i = 0; i < elements.length; i++) {
    const { idUser } = elements[i];
    if (users[idUser] === undefined) idUsers.push(idUser);
  }
  if (idUsers.length > 0)
    await axios
      .post("/user/get", {
        idUsers,
      })
      .then(({ data: { users: u } }) => {
        let usersKey = {};

        for (let i = 0; i < u.length; i++) {
          const { id, firstName, lastName, photo } = u[i];
          usersKey[id] = {
            id,
            firstName,
            lastName,
            photo,
          };
        }
        setUsers({
          ...users,
          ...usersKey,
        });
      });
};

export const muteUser = ({ idMuteUser, setMuteUser, isSingle, setError }) => {
  axios
    .post("/user/mute", {
      idMuteUser,
    })
    .then((resp) => {
      isSingle && Router.push("/");
      setMuteUser({ idUser: idMuteUser });
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const blockUser = ({
  idBlockUser,
  posts,
  setPosts,
  isSingle,
  setError,
}) => {
  axios
    .post("/user/block", { idBlockUser })
    .then((resp) => {
      isSingle && Router.push("/");
      const filtredPosts = posts.filter((post) => {
        const idUser = post.idUserShare || post.idUser;
        return idUser != idBlockUser;
      });
      setPosts(filtredPosts);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const getPosts = ({
  idFanpage,
  idGroup,
  news,
  idUser,
  authorPost,
  posts,
  setPosts,
  from,
  users,
  setUsers,
  setStatusOfMorePosts,
  setStatusOfMoreComments,
}) => {
  axios
    .post("/post/get", { from, idGroup, idFanpage, news, authorPost, idUser })
    .then(
      async ({ data: { posts: p, comments, isMorePosts, isMoreComments } }) => {
        await getUsers(users, setUsers, [...p, ...comments]);
        const commentsKey = {};
        for (let i = 0; i < comments.length; i++) {
          if (!commentsKey[comments[i].idPost])
            commentsKey[comments[i].idPost] = [];
          commentsKey[comments[i].idPost].push(comments[i]);
        }
        const newPosts = p.map((item) => {
          return {
            ...item,
            id: uuid(),
            comments: commentsKey[item.idPost],
            isMoreComments:
              commentsKey[item.idPost] == undefined
                ? false
                : commentsKey[item.idPost][0].number < 4
                ? false
                : true,
          };
        });
        setStatusOfMorePosts(isMorePosts);
        setStatusOfMoreComments(isMoreComments);
        setPosts([...posts, ...newPosts]);
      }
    );
};

export const addPost = ({
  content,
  date,
  photo,
  posts,
  setPosts,
  clearText,
  setError,
}) => {
  axios
    .post("/post/add", {
      content,
      date,
      photo,
    })
    .then(({ data: { idPost: id, idUser } }) => {
      setUser(data.user);
      setPosts([
        {
          id,
          idUser,
          content,
          date,
          comments: null,
          numberOfLikes: 0,
          numberOfShares: 0,
          numberOfComments: 0,
          photo: "profile.png",
        },
        ...posts,
      ]);
      clearText("");
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const likePost = ({ idPost, setNewLike, setError }) => {
  axios
    .post("/post/like", { idPost })
    .then(({ data: { idLike } }) =>
      setNewLike({ idLike, idElement: idPost, type: "post" })
    )
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const unlikePost = ({ idLike, idPost, setNewLike, setError }) => {
  axios
    .post("/post/unlike", { idLike })
    .then((resp) =>
      setNewLike({ idLike: null, idElement: idPost, type: "post" })
    )
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const sharePost = ({ post, posts, setPosts, setError, isSingle }) => {
  const date = new Date();
  axios
    .post("/post/share", {
      idPost: post.idPost,
      date,
    })
    .then(({ data: { idShare, idUser } }) => {
      !isSingle &&
        setPosts([
          {
            ...post,
            idShare,
            id: uuid(),
            date,
            idUserShare: idUser,
            numberOfShares: Number(post.numberOfShares) + 1,
          },
          ...posts,
        ]);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const editPost = ({
  idPost,
  content,
  setNewContent,
  setStatusOfEdit,
  setError,
}) => {
  axios
    .post("/post/edit", { idPost, content })
    .then((resp) => {
      setNewContent({ text: content, idPost });
      setStatusOfEdit(false);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const deletePost = ({ idPost, posts, setPosts, isSingle, setError }) => {
  axios
    .post("/post/delete", { idPost })
    .then((resp) => {
      isSingle && Router.push("/");
      const newPosts = posts.filter((post) => post.idPost != idPost);
      setPosts(newPosts);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const deletePostShare = ({
  idShare,
  posts,
  setPosts,
  isSingle,
  setError,
}) => {
  axios
    .post("/post/share/delete", { idShare })
    .then((resp) => {
      isSingle && Router.push("/");
      const newPosts = posts.filter((post) => post.idShare != idShare);
      setPosts(newPosts);
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const getComments = ({
  idPost,
  from,
  users,
  setUsers,
  comments,
  setComments,
  setStatusOfMoreData,
}) => {
  axios
    .post("/comment/get", { idPost, from })
    .then(async ({ data: { comments: newComments, isMore } }) => {
      await getUsers(users, setUsers, newComments);
      setComments([...comments, ...newComments]);
      setStatusOfMoreData(isMore);
    });
};

export const addComent = ({
  idPost,
  content,
  date,
  clearText,
  setNewComment,
  setError,
}) => {
  axios
    .post("/comment/add", {
      idPost,
      content,
      date,
    })
    .then(({ data: { idComment } }) => {
      setNewComment({
        content,
        idElement: idPost,
        idComment,
        type: "post",
        date,
      });
      clearText("");
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const likeComment = ({ idComment, setNewLike, setError }) => {
  axios
    .post("/comment/like", { idComment })
    .then(({ data: { idLike } }) => {
      setNewLike({
        idLike,
        idElement: idComment,
        type: "comment",
      });
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const unlikeComment = ({ idLike, idComment, setNewLike, setError }) => {
  axios
    .post("/comment/unlike", { idLike })
    .then((resp) =>
      setNewLike({ idLike: null, idElement: idComment, type: "comment" })
    )
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const getReplies = async ({
  idComment,
  from,
  replies,
  setReplies,
  users,
  setUsers,
  setStatusOfMoreData,
}) => {
  axios
    .post("/reply/get", {
      idComment,
      from,
    })
    .then(async ({ data: { replies: r, isMore } }) => {
      await getUsers(users, setUsers, r);
      setReplies([...replies, ...r]);
      setStatusOfMoreData(isMore);
    });
};

export const addReply = ({
  idComment,
  content,
  date,
  clearText,
  setNewComment,
  setError,
}) => {
  axios
    .post("/reply/add", {
      idComment,
      content,
      date,
    })
    .then(({ data: { idReply } }) => {
      setNewComment({
        content,
        idElement: idComment,
        idReply,
        type: "comment",
        date,
      });
      clearText("");
    })
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const likeReply = async ({ idReply, setNewLike, setError }) => {
  axios
    .post("/reply/like", { idReply })
    .then(({ data: { idLike } }) =>
      setNewLike({ idLike, idElement: idReply, type: "reply" })
    )
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};

export const unlikeReply = async ({
  idLike,
  idReply,
  setNewLike,
  setError,
}) => {
  axios
    .post("/reply/unlike", { idLike })
    .then((resp) =>
      setNewLike({ idLike: null, idElement: idReply, type: "reply" })
    )
    .catch((err) => {
      const {
        response: { data: message },
      } = err;
      setError(message);
    });
};
